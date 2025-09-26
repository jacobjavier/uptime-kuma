<template>
    <div class="downtime-report">
        <!-- Selector de período de tiempo -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <font-awesome-icon icon="calendar-alt" class="me-2" />
                            Período de Reporte
                        </h5>
                        <div class="d-flex gap-2">
                            <select v-model="selectedPeriod" class="form-select">
                                <option value="24h">Últimas 24 horas</option>
                                <option value="7d">Últimos 7 días</option>
                                <option value="30d">Últimos 30 días</option>
                                <option value="90d">Últimos 90 días</option>
                                <option value="1y">Último año</option>
                            </select>
                            <button @click="generateReport" class="btn btn-primary">
                                <font-awesome-icon icon="sync" /> Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <font-awesome-icon icon="download" class="me-2" />
                            Exportar Reporte
                        </h5>
                        <div class="d-flex gap-2">
                            <button @click="exportCSV" class="btn btn-outline-success">
                                <font-awesome-icon icon="file-csv" /> CSV
                            </button>
                            <button @click="exportJSON" class="btn btn-outline-primary">
                                <font-awesome-icon icon="file-code" /> JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas generales -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body text-center">
                        <div class="stats-icon bg-success">
                            <font-awesome-icon icon="check-circle" />
                        </div>
                        <h3>{{ formatUptime(overallUptime) }}</h3>
                        <p class="text-muted mb-0">Disponibilidad Total</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body text-center">
                        <div class="stats-icon bg-danger">
                            <font-awesome-icon icon="times-circle" />
                        </div>
                        <h3>{{ totalIncidents }}</h3>
                        <p class="text-muted mb-0">Total de Incidentes</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body text-center">
                        <div class="stats-icon bg-warning">
                            <font-awesome-icon icon="clock" />
                        </div>
                        <h3>{{ formatDuration(totalDowntime) }}</h3>
                        <p class="text-muted mb-0">Tiempo Total Caído</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stats-card">
                    <div class="card-body text-center">
                        <div class="stats-icon bg-info">
                            <font-awesome-icon icon="hourglass-half" />
                        </div>
                        <h3>{{ formatDuration(avgDowntime) }}</h3>
                        <p class="text-muted mb-0">Tiempo Promedio Caído</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de incidentes recientes -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <font-awesome-icon icon="list" class="me-2" />
                            Historial de Incidentes
                        </h5>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Monitor</th>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                        <th>Duración</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="incident in incidents" :key="incident.id">
                                        <td>
                                            <strong>{{ incident.monitorName }}</strong>
                                        </td>
                                        <td>{{ formatDateTime(incident.startTime) }}</td>
                                        <td>{{ incident.endTime ? formatDateTime(incident.endTime) : '-' }}</td>
                                        <td>
                                            <span class="badge bg-warning">
                                                {{ formatDuration(incident.duration) }}
                                            </span>
                                        </td>
                                        <td>
                                            <span :class="getStatusBadgeClass(incident.status)">
                                                {{ getStatusText(incident.status) }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="incidents.length === 0">
                                        <td colspan="5" class="text-center text-muted">
                                            No hay incidentes registrados para este período
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";

export default {
    props: {
        monitorId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            selectedPeriod: "7d",
            overallUptime: 95.8,
            totalIncidents: 4,
            totalDowntime: 7200000, // 2 horas en ms
            avgDowntime: 1800000, // 30 minutos en ms
            incidents: [
                {
                    id: 1,
                    monitorName: "BGPv6 Zayo Local",
                    startTime: new Date(Date.now() - 86400000),
                    endTime: new Date(Date.now() - 82800000),
                    duration: 3600000, // 1 hora
                    status: "resolved"
                },
                {
                    id: 2,
                    monitorName: "BGPv6 Sparkle Gw",
                    startTime: new Date(Date.now() - 172800000),
                    endTime: new Date(Date.now() - 169200000),
                    duration: 3600000, // 1 hora
                    status: "resolved"
                },
                {
                    id: 3,
                    monitorName: "BGPv6 Sparkle Local",
                    startTime: new Date(Date.now() - 259200000),
                    endTime: new Date(Date.now() - 255600000),
                    duration: 3600000, // 1 hora
                    status: "resolved"
                }
            ]
        };
    },
    mounted() {
        this.loadReportData();
    },
    methods: {
        async loadReportData() {
            // Simular carga de datos basados en los monitores reales
            this.calculateStatistics();
        },
        calculateStatistics() {
            // Calcular estadísticas basadas en el período seleccionado
            const periodMs = this.getPeriodInMs();
            this.overallUptime = ((periodMs - this.totalDowntime) / periodMs) * 100;
        },
        getPeriodInMs() {
            switch (this.selectedPeriod) {
                case "24h": return 24 * 60 * 60 * 1000;
                case "7d": return 7 * 24 * 60 * 60 * 1000;
                case "30d": return 30 * 24 * 60 * 60 * 1000;
                case "90d": return 90 * 24 * 60 * 60 * 1000;
                case "1y": return 365 * 24 * 60 * 60 * 1000;
                default: return 7 * 24 * 60 * 60 * 1000;
            }
        },
        formatUptime(uptime) {
            return uptime.toFixed(2) + "%";
        },
        formatDuration(ms) {
            if (ms < 60000) {
                return Math.round(ms / 1000) + "s";
            } else if (ms < 3600000) {
                return Math.round(ms / 60000) + "m";
            } else if (ms < 86400000) {
                return Math.round(ms / 3600000) + "h";
            } else {
                return Math.round(ms / 86400000) + "d";
            }
        },
        formatDateTime(date) {
            return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
        },
        getStatusBadgeClass(status) {
            return {
                "badge": true,
                "bg-success": status === "resolved",
                "bg-danger": status === "ongoing",
                "bg-warning": status === "investigating"
            };
        },
        getStatusText(status) {
            const statusMap = {
                "resolved": "Resuelto",
                "ongoing": "En curso",
                "investigating": "Investigando"
            };
            return statusMap[status] || status;
        },
        async generateReport() {
            await this.loadReportData();
        },
        async exportCSV() {
            const csv = this.generateCSV();
            this.downloadFile(csv, "reporte-downtime.csv", "text/csv");
        },
        async exportJSON() {
            const json = JSON.stringify({
                period: this.selectedPeriod,
                statistics: {
                    uptime: this.overallUptime,
                    totalIncidents: this.totalIncidents,
                    totalDowntime: this.totalDowntime,
                    avgDowntime: this.avgDowntime
                },
                incidents: this.incidents
            }, null, 2);
            this.downloadFile(json, "reporte-downtime.json", "application/json");
        },
        generateCSV() {
            let csv = "Monitor,Inicio,Fin,Duración,Estado\n";
            this.incidents.forEach(inc => {
                csv += `"${inc.monitorName}",`;
                csv += `"${this.formatDateTime(inc.startTime)}",`;
                csv += `"${inc.endTime ? this.formatDateTime(inc.endTime) : '-'}",`;
                csv += `"${this.formatDuration(inc.duration)}",`;
                csv += `"${this.getStatusText(inc.status)}"\n`;
            });
            return csv;
        },
        downloadFile(content, filename, type) {
            const blob = new Blob([content], { type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
        }
    }
};
</script>

<style scoped>
.downtime-report {
    padding: 20px;
}

.stats-card {
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stats-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 24px;
    color: white;
}

.table td {
    vertical-align: middle;
}

@media (max-width: 768px) {
    .stats-card {
        margin-bottom: 15px;
    }
    
    .d-flex.gap-2 {
        flex-direction: column;
    }
    
    .d-flex.gap-2 > * {
        margin-bottom: 10px;
    }
}
</style>