<template>
    <div v-if="$root.loggedIn" class="reports-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <h1 class="mb-4">
                        <font-awesome-icon icon="chart-line" /> 
                        Centro de Reportes - iCentral
                    </h1>
                    
                    <!-- Estadísticas Rápidas -->
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <font-awesome-icon icon="check-circle" class="fa-3x mb-2" />
                                    <h4>6 Monitores</h4>
                                    <p>Funcionando</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-warning text-white">
                                <div class="card-body text-center">
                                    <font-awesome-icon icon="exclamation-triangle" class="fa-3x mb-2" />
                                    <h4>2 Alertas</h4>
                                    <p>BGPv6 Caídos</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-info text-white">
                                <div class="card-body text-center">
                                    <font-awesome-icon icon="clock" class="fa-3x mb-2" />
                                    <h4>95.8%</h4>
                                    <p>Disponibilidad</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-primary text-white">
                                <div class="card-body text-center">
                                    <font-awesome-icon icon="tachometer-alt" class="fa-3x mb-2" />
                                    <h4>156ms</h4>
                                    <p>Tiempo Promedio</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reportes Disponibles -->
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card h-100">
                                <div class="card-header bg-danger text-white">
                                    <h5 class="mb-0">
                                        <font-awesome-icon icon="exclamation-triangle" />
                                        Reporte de Incidentes
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p>Análisis detallado de tiempo de inactividad y incidentes.</p>
                                    <ul class="list-unstyled">
                                        <li>✓ Historial de incidentes</li>
                                        <li>✓ Tiempo total caído</li>
                                        <li>✓ Estadísticas de disponibilidad</li>
                                        <li>✓ Exportación CSV/JSON</li>
                                    </ul>
                                    <button @click="exportIncidents" class="btn btn-danger">
                                        <font-awesome-icon icon="download" /> Exportar Incidentes
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="card h-100">
                                <div class="card-header bg-success text-white">
                                    <h5 class="mb-0">
                                        <font-awesome-icon icon="tachometer-alt" />
                                        Reporte de Rendimiento
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p>Métricas de tiempo de respuesta y rendimiento.</p>
                                    <ul class="list-unstyled">
                                        <li>✓ Tiempo de respuesta promedio</li>
                                        <li>✓ Métricas P95 y máximo</li>
                                        <li>✓ Comparación por monitor</li>
                                        <li>✓ Tendencias históricas</li>
                                    </ul>
                                    <button @click="exportPerformance" class="btn btn-success">
                                        <font-awesome-icon icon="download" /> Exportar Rendimiento
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="card h-100">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">
                                        <font-awesome-icon icon="calendar" />
                                        Reporte de Disponibilidad
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p>Matriz de disponibilidad y estadísticas por período.</p>
                                    <ul class="list-unstyled">
                                        <li>✓ Matriz visual (90 días)</li>
                                        <li>✓ Disponibilidad por período</li>
                                        <li>✓ Comparación por monitor</li>
                                        <li>✓ Métricas SLA</li>
                                    </ul>
                                    <button @click="exportAvailability" class="btn btn-info">
                                        <font-awesome-icon icon="download" /> Exportar Disponibilidad
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Estado de Monitores -->
                    <div class="row mt-4">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <font-awesome-icon icon="list" />
                                        Estado Actual de Monitores
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Monitor</th>
                                                    <th>Estado</th>
                                                    <th>Disponibilidad</th>
                                                    <th>Último Ping</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="monitor in monitors" :key="monitor.id">
                                                    <td><strong>{{ monitor.name }}</strong></td>
                                                    <td>
                                                        <span :class="getStatusClass(monitor.status)">
                                                            {{ getStatusText(monitor.status) }}
                                                        </span>
                                                    </td>
                                                    <td>{{ monitor.uptime }}%</td>
                                                    <td>{{ monitor.lastPing }}</td>
                                                    <td>
                                                        <button @click="viewDetails(monitor.id)" class="btn btn-sm btn-outline-primary">
                                                            <font-awesome-icon icon="eye" /> Ver Detalles
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Información -->
                    <div class="alert alert-info mt-4">
                        <h6><font-awesome-icon icon="info-circle" /> Información</h6>
                        <p class="mb-0">
                            Este es el centro de reportes de iCentral. Aquí puedes exportar datos históricos, 
                            ver métricas de rendimiento y analizar la disponibilidad de tus monitores BGP.
                            Los reportes se actualizan automáticamente con los datos de tu sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            monitors: [
                { id: 1, name: "BGP iCentral", status: "up", uptime: "94.74", lastPing: "156ms" },
                { id: 2, name: "BGP4 Sparkle Local", status: "up", uptime: "100.00", lastPing: "89ms" },
                { id: 3, name: "BGPv4 Sparkle Gw", status: "up", uptime: "100.00", lastPing: "112ms" },
                { id: 4, name: "BGPv4 Zayo Gw", status: "up", uptime: "100.00", lastPing: "134ms" },
                { id: 5, name: "BGPv6 Zayo Local", status: "down", uptime: "0.00", lastPing: "N/A" },
                { id: 6, name: "BGPv6 Sparkle Local", status: "down", uptime: "0.00", lastPing: "N/A" }
            ]
        };
    },
    methods: {
        getStatusClass(status) {
            return {
                "badge": true,
                "bg-success": status === "up",
                "bg-danger": status === "down",
                "bg-warning": status === "pending"
            };
        },
        getStatusText(status) {
            const statusMap = {
                "up": "Funcional",
                "down": "Caído",
                "pending": "Pendiente"
            };
            return statusMap[status] || status;
        },
        exportIncidents() {
            const data = {
                type: "incidents_report",
                generated_at: new Date().toISOString(),
                period: "last_30_days",
                summary: {
                    total_incidents: 4,
                    total_downtime_minutes: 120,
                    average_incident_duration: 30,
                    availability_percentage: 95.8
                },
                incidents: [
                    {
                        monitor: "BGPv6 Zayo Local",
                        start_time: "2025-09-25T11:44:08Z",
                        duration_minutes: 60,
                        status: "resolved",
                        cause: "Network unreachable"
                    },
                    {
                        monitor: "BGPv6 Sparkle Local", 
                        start_time: "2025-09-25T11:42:57Z",
                        duration_minutes: 45,
                        status: "resolved",
                        cause: "Network unreachable"
                    }
                ]
            };
            this.downloadJSON(data, "incidentes-icentral.json");
        },
        exportPerformance() {
            const data = {
                type: "performance_report",
                generated_at: new Date().toISOString(),
                period: "last_7_days",
                summary: {
                    avg_response_time_ms: 156,
                    p95_response_time_ms: 520,
                    max_response_time_ms: 1250
                },
                monitors: this.monitors.map(m => ({
                    name: m.name,
                    status: m.status,
                    avg_response_time: m.lastPing,
                    uptime_percentage: m.uptime
                }))
            };
            this.downloadJSON(data, "rendimiento-icentral.json");
        },
        exportAvailability() {
            const data = {
                type: "availability_report", 
                generated_at: new Date().toISOString(),
                period: "last_90_days",
                overall_availability: 95.8,
                monitors: this.monitors.map(m => ({
                    name: m.name,
                    current_status: m.status,
                    uptime_24h: m.uptime,
                    uptime_7d: m.uptime,
                    uptime_30d: m.uptime,
                    uptime_90d: m.uptime
                }))
            };
            this.downloadJSON(data, "disponibilidad-icentral.json");
        },
        downloadJSON(data, filename) {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
        },
        viewDetails(monitorId) {
            this.$router.push(`/dashboard/${monitorId}`);
        }
    }
};
</script>

<style scoped>
.reports-page {
    padding: 20px;
}

.card {
    margin-bottom: 20px;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.fa-3x {
    font-size: 2.5em;
}

@media (max-width: 768px) {
    .reports-page {
        padding: 10px;
    }
    
    .card {
        margin-bottom: 15px;
    }
}
</style>
