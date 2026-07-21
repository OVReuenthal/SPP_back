import { Injectable } from '@nestjs/common';
import { cumulativeStdNormalProbability } from 'simple-statistics';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateProyeccioneDto } from './dto/create-proyeccione.dto';
import { CreateProyeccionDto } from './dto/create-proyeccion.dto';
import { UpdateProyeccioneDto } from './dto/update-proyeccione.dto';

@Injectable()
export class ProyeccionesService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // ─── Actividad CRUD ───────────────────────────────────────────────────────

  async createActividad(createProyeccioneDto: CreateProyeccioneDto) {
    const sql = `INSERT INTO actividad (nombre, descripcion, elemento_pep_secundario, codigo_proveedor, id_estado, id_clase, id_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const codigoProveedor = createProyeccioneDto.codigo_proveedor ?? null;
    return await this.dataSource.query(sql, [
      createProyeccioneDto.nombre,
      createProyeccioneDto.descripcion,
      createProyeccioneDto.elemento_pep_secundario,
      codigoProveedor,
      createProyeccioneDto.id_estado,
      createProyeccioneDto.id_clase,
      createProyeccioneDto.id_tipo,
    ]);
  }

  async createProyeccion(createProyeccionDto: CreateProyeccionDto) {
    const checkSql = `SELECT * FROM proyeccion WHERE id_actividad = $1`;
    const existing = await this.dataSource.query(checkSql, [
      createProyeccionDto.id_actividad,
    ]);

    if (existing.length > 0) {
      await this.dataSource.query(
        `DELETE FROM proyeccion WHERE id_actividad = $1`,
        [createProyeccionDto.id_actividad],
      );
    }

    const sql = `INSERT INTO proyeccion (id_actividad, id_distribucion, monto, duracion) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await this.dataSource.query(sql, [
      createProyeccionDto.id_actividad,
      createProyeccionDto.id_distribucion,
      createProyeccionDto.monto,
      createProyeccionDto.duracion,
    ]);

    await this.insertarMesesProyeccion(
      createProyeccionDto.id_actividad,
      createProyeccionDto.mes_inicio,
      createProyeccionDto.id_distribucion,
      createProyeccionDto.duracion,
    );

    const actividadQuery = `SELECT elemento_pep_secundario FROM actividad WHERE id_actividad = $1`;
    const actividad = await this.dataSource.query(actividadQuery, [
      createProyeccionDto.id_actividad,
    ]);
    if (actividad.length > 0) {
      await this.actualizarPresupuestos(actividad[0].elemento_pep_secundario);
    }

    return result;
  }

  async update(
    id_actividad: number,
    updateProyeccioneDto: UpdateProyeccioneDto,
  ) {
    const oldActividadQuery = `SELECT elemento_pep_secundario FROM actividad WHERE id_actividad = $1`;
    const oldActividad = await this.dataSource.query(oldActividadQuery, [
      id_actividad,
    ]);
    const oldElementoPep =
      oldActividad.length > 0 ? oldActividad[0].elemento_pep_secundario : null;

    const sql = `UPDATE actividad SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion), elemento_pep_secundario = COALESCE($3, elemento_pep_secundario), codigo_proveedor = COALESCE($4, codigo_proveedor), id_estado = COALESCE($5, id_estado), id_clase = COALESCE($6, id_clase), id_tipo = COALESCE($7, id_tipo) WHERE id_actividad = $8 RETURNING *`;
    const result = await this.dataSource.query(sql, [
      updateProyeccioneDto.nombre,
      updateProyeccioneDto.descripcion,
      updateProyeccioneDto.elemento_pep_secundario,
      updateProyeccioneDto.codigo_proveedor,
      updateProyeccioneDto.id_estado,
      updateProyeccioneDto.id_clase,
      updateProyeccioneDto.id_tipo,
      id_actividad,
    ]);

    const newElementoPep =
      result.length > 0 ? result[0].elemento_pep_secundario : null;

    // Si la actividad cambió de proyecto_menor, actualizamos ambos lados
    if (oldElementoPep && oldElementoPep !== newElementoPep) {
      await this.actualizarPresupuestos(oldElementoPep);
    }
    if (newElementoPep) {
      await this.actualizarPresupuestos(newElementoPep);
    }

    return result;
  }

  async remove(id_actividad: number) {
    const oldActividadQuery = `SELECT elemento_pep_secundario FROM actividad WHERE id_actividad = $1`;
    const oldActividad = await this.dataSource.query(oldActividadQuery, [
      id_actividad,
    ]);
    const oldElementoPep =
      oldActividad.length > 0 ? oldActividad[0].elemento_pep_secundario : null;

    const result = await this.dataSource.query(
      `DELETE FROM actividad WHERE id_actividad = $1`,
      [id_actividad],
    );

    if (oldElementoPep) {
      await this.actualizarPresupuestos(oldElementoPep);
    }

    return result;
  }

  // ─── Queries de lectura ───────────────────────────────────────────────────

  async findAll() {
    return await this.dataSource.query(`SELECT * FROM actividad`);
  }

  async findOne(id_actividad: number) {
    return await this.dataSource.query(
      `SELECT * FROM actividad WHERE id_actividad = $1`,
      [id_actividad],
    );
  }

  async findByEmpresa(codigo_proveedor: string) {
    return await this.dataSource.query(
      `SELECT * FROM actividad WHERE codigo_proveedor = $1`,
      [codigo_proveedor],
    );
  }

  async findByElementoPepSecundario(elemento_pep_secundario: string) {
    return await this.dataSource.query(
      `SELECT * FROM actividad WHERE elemento_pep_secundario = $1`,
      [elemento_pep_secundario],
    );
  }

  async findByEstado(id_estado: number) {
    return await this.dataSource.query(
      `SELECT * FROM actividad WHERE id_estado = $1`,
      [id_estado],
    );
  }

  async findByClase(id_clase: number) {
    return await this.dataSource.query(
      `SELECT * FROM actividad WHERE id_clase = $1`,
      [id_clase],
    );
  }

  async findByTipo(id_tipo: number) {
    return await this.dataSource.query(
      `SELECT * FROM actividad WHERE id_tipo = $1`,
      [id_tipo],
    );
  }

  async obtenerActividadesConDetalles() {
    const sql = `
      SELECT 
        a.id_actividad, 
        a.nombre AS actividad_nombre, 
        a.elemento_pep_secundario, 
        pmenor.nombre AS proyecto_menor_nombre, 
        pmayor.nombre AS proyecto_mayor_nombre, 
        e.nombre AS empresa_nombre, 
        ea.nombre AS estado_nombre, 
        cc.nombre AS clase_costo_nombre, 
        tp.nombre AS tipo_presupuesto_nombre, 
        p.monto AS monto_proyeccion, 
        d.nombre AS distribucion_nombre, 
        pmenor.presupuesto AS presupuesto_total,
        COALESCE(
          json_agg(
            json_build_object(
              'mes', TO_CHAR(mp.mes, 'YYYY-MM-DD'),
              'monto_mes', p.monto * mp.porcentaje
            ) ORDER BY mp.mes
          ) FILTER (WHERE mp.mes IS NOT NULL), 
          '[]'
        ) AS meses_ejecucion
      FROM actividad a
      LEFT JOIN proyecto_menor pmenor ON a.elemento_pep_secundario = pmenor.elemento_pep_secundario
      LEFT JOIN proyecto_mayor pmayor ON pmenor.elemento_pep = pmayor.elemento_pep
      LEFT JOIN empresas e ON a.codigo_proveedor = e.codigo_proveedor
      LEFT JOIN estado_actividad ea ON a.id_estado = ea.id_estado
      LEFT JOIN clases_costos cc ON a.id_clase = cc.id_clase
      LEFT JOIN tipo_presupuesto tp ON a.id_tipo = tp.id_tipo
      LEFT JOIN proyeccion p ON a.id_actividad = p.id_actividad
      LEFT JOIN distribucion d ON p.id_distribucion = d.id_distribucion
      LEFT JOIN meses_proyeccion mp ON a.id_actividad = mp.id_actividad
      GROUP BY 
        a.id_actividad, 
        pmenor.nombre, 
        pmayor.nombre, 
        e.nombre, 
        ea.nombre, 
        cc.nombre, 
        tp.nombre, 
        p.monto, 
        d.nombre, 
        pmenor.presupuesto
    `;
    return await this.dataSource.query(sql);
  }

  // ─── Meses de proyección ──────────────────────────────────────────────────

  private async insertarMesesProyeccion(
    id_actividad: number,
    mes_inicio: string | Date,
    id_distribucion: number,
    duracion: number,
  ) {
    let mesInicioValue = mes_inicio;
    if (
      typeof mesInicioValue === 'string' &&
      /^\d{4}-\d{2}$/.test(mesInicioValue)
    ) {
      mesInicioValue = `${mesInicioValue}-01`;
    }

    const startDate = new Date(mesInicioValue);
    if (Number.isNaN(startDate.getTime())) {
      throw new Error('mes_inicio inválido para generar meses de proyección');
    }

    let porcentajes: number[] = [];
    if (id_distribucion === 1) {
      const val = Number((1 / duracion).toFixed(3));
      porcentajes = new Array(duracion).fill(val);
    } else if (id_distribucion === 2) {
      porcentajes = this.generarPorcentajesCampana(duracion);
    } else {
      throw new Error('Distribución no soportada');
    }

    const values: string[] = [];
    for (let i = 0; i < duracion; i++) {
      const currentDate = new Date(startDate);
      currentDate.setUTCMonth(currentDate.getUTCMonth() + i);
      const mesStr = currentDate.toISOString().split('T')[0];
      const pct = porcentajes[i];
      values.push(`(${id_actividad}, '${mesStr}', ${pct})`);
    }

    await this.dataSource.query(
      `DELETE FROM meses_proyeccion WHERE id_actividad = $1`,
      [id_actividad],
    );

    if (values.length > 0) {
      const sql = `INSERT INTO meses_proyeccion (id_actividad, mes, porcentaje) VALUES ${values.join(', ')} RETURNING id_actividad, TO_CHAR(mes, 'YYYY-MM-DD') AS mes, porcentaje`;
      return await this.dataSource.query(sql);
    }

    return [];
  }

  async generarMesesProyeccion(id_actividad: number) {
    const proyeccionRows = await this.dataSource.query(
      `SELECT id_distribucion, duracion FROM proyeccion WHERE id_actividad = $1`,
      [id_actividad],
    );
    if (proyeccionRows.length === 0) {
      throw new Error('Proyección no encontrada para la actividad indicada');
    }
    const { id_distribucion, duracion } = proyeccionRows[0];

    const existingMes = await this.dataSource.query(
      `SELECT mes FROM meses_proyeccion WHERE id_actividad = $1 ORDER BY mes LIMIT 1`,
      [id_actividad],
    );
    if (existingMes.length === 0) {
      throw new Error(
        'No se puede regenerar meses sin un mes de inicio almacenado. Cree la proyección con mes_inicio primero.',
      );
    }

    return this.insertarMesesProyeccion(
      id_actividad,
      existingMes[0].mes,
      id_distribucion,
      duracion,
    );
  }

  // ─── Distribuciones ───────────────────────────────────────────────────────

  generarPorcentajesCampana(duracion: number): number[] {
    const porcentajes = new Array(duracion).fill(0);
    const media = duracion / 2;
    const desviacionEstandar = duracion / 4;

    const normDist = (x: number) => {
      return cumulativeStdNormalProbability((x - media) / desviacionEstandar);
    };

    const normDist0 = normDist(0);
    const normDistDuracion = normDist(duracion);
    const denom = normDistDuracion - normDist0;

    const calcularPorcentaje = (x: number) => {
      if (denom === 0) return 0;
      return (normDist(x) - normDist0) / denom;
    };

    for (let i = 0; i < duracion; i++) {
      const valor = calcularPorcentaje(i + 1) - calcularPorcentaje(i);
      porcentajes[i] = Number(valor.toFixed(3));
    }

    return porcentajes;
  }

  distribuirEnCampana(
    monto: number,
    duracion: number,
    mesInicio: number,
    totalMeses: number = 12,
  ): number[] {
    const distribucion = new Array(totalMeses).fill(0);
    const media = duracion / 2;
    const desviacionEstandar = duracion / 4;

    const normDist = (x: number) => {
      return cumulativeStdNormalProbability((x - media) / desviacionEstandar);
    };

    const normDist0 = normDist(0);
    const normDistDuracion = normDist(duracion);
    const denom = normDistDuracion - normDist0;

    const calcularPorcentaje = (x: number) => {
      if (denom === 0) return 0;
      return (normDist(x) - normDist0) / denom;
    };

    for (let i = 0; i < totalMeses; i++) {
      const mes = i + 1;
      if (mes >= mesInicio && mes < mesInicio + duracion) {
        const mesRelativo = mes - mesInicio;
        const valor =
          monto *
          (calcularPorcentaje(mesRelativo + 1) -
            calcularPorcentaje(mesRelativo));
        distribucion[i] = Number(valor.toFixed(3));
      }
    }
    const sumaDistribucion = distribucion.reduce((a, b) => a + b, 0);
    console.log('Monto solicitado:', monto);
    console.log('monto total:', sumaDistribucion);
    console.log('Distribución en campana:', distribucion);
    return distribucion;
  }

  // ─── Actualización de presupuestos ────────────────────────────────────────

  /**
   * Actualiza en cascada el presupuesto de proyecto_menor y su proyecto_mayor
   * padre a partir de la suma de montos de las proyecciones asociadas.
   *
   * @param elemento_pep_secundario - clave del proyecto_menor a recalcular
   * @param elemento_pep            - (opcional) clave del proyecto_mayor;
   *                                  si se omite se resuelve automáticamente
   *                                  desde el RETURNING del UPDATE de proyecto_menor
   */
  async actualizarPresupuestos(elemento_pep_secundario: string) {
    if (!elemento_pep_secundario) return;

    // 1. Recalcular presupuesto del proyecto_menor sumando montos de sus actividades
    const sqlMenor = `
      UPDATE proyecto_menor pm
      SET presupuesto = (
        SELECT COALESCE(SUM(p.monto), 0)
        FROM actividad a
        JOIN proyeccion p ON a.id_actividad = p.id_actividad
        WHERE a.elemento_pep_secundario = pm.elemento_pep_secundario
      )
      WHERE pm.elemento_pep_secundario = $1
    `;
    await this.dataSource.query(sqlMenor, [elemento_pep_secundario]);

    // 2. Resolver el elemento_pep del proyecto_mayor explícitamente
    const pepQuery = `
      SELECT elemento_pep FROM proyecto_menor
      WHERE elemento_pep_secundario = $1
    `;
    const pepResult = await this.dataSource.query(pepQuery, [
      elemento_pep_secundario,
    ]);

    if (!pepResult.length || !pepResult[0].elemento_pep) return;

    const elemento_pep = pepResult[0].elemento_pep;

    // 3. Recalcular presupuesto del proyecto_mayor sumando los presupuestos
    //    de todos sus proyecto_menor hijos (ya actualizados en el paso 1)
    const sqlMayor = `
      UPDATE proyecto_mayor pm
      SET presupuesto = (
        SELECT COALESCE(SUM(pmenor.presupuesto), 0)
        FROM proyecto_menor pmenor
        WHERE pmenor.elemento_pep = pm.elemento_pep
      )
      WHERE pm.elemento_pep = $1
    `;
    await this.dataSource.query(sqlMayor, [elemento_pep]);
  }
}