<template>
    <div class="availability-report">
        <!-- Matriz de disponibilidad estilo GitHub -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <font-awesome-icon icon="calendar" class="me-2" />
                            Matriz de Disponibilidad (Últimos 90 días)
                        </h5>
                        <div class="availability-grid">
                            <div v-for="(week, weekIndex) in availabilityMatrix" :key="weekIndex" class="week-row">
                                <div v-for="(day, dayIndex) in week" :key="dayIndex" 
                                     class="day-cell" 
                                     :class="getAvailabilityClass(day.uptime)"
                                     :title="`${day.date}: ${day.uptime.toFixed(1)}% disponible`">
                                </div>
                            </div>
                        </div>
                        <div class="legend mt-3 d-flex justify-content-center">
                            <span class="legend-item me-3">
                                <span class="legend-color availability-high"></span>
                                100% Disponible
                            </span>
                            <span class="legend-item me-3">
                                <span class="legend-color availability-medium"></span>
                                95-99% Disponible
                            </span>
                            <span class="legend-item me-3">
                                <span class="legend-color availability-low"></span>
                                &lt;95% Disponible
                            </span>
                            <span class="legend-item">
                                <span class="legend-color availability-none"></span>
                                Sin datos
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estadísticas por monitor -->
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    <font-awesome-icon icon="chart-bar" class="me-2" />
                    Disponibilidad por Monitor
                </h5>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Monitor</th>
                                <th>Estado Actual</th>
                                <th>24h</th>
                                <th>7d</th>
                                <th>30d</th>
                                <th>90d</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="monitor in monitors" :key="monitor.id">
                                <td>
                                    <strong>{{ monitor.name }}</strong>
                                </td>
                                <td>
                                    <span :class="getStatusBadge(monitor.currentStatus)">
                                        {{ getStatusText(monitor.currentStatus) }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="getUptimeBadge(monitor.uptime24h)">
                                        {{ monitor.uptime24h }}%
                                    </span>
                                </td>
                                <td>
                                    <span :class="getUptimeBadge(monitor.uptime7d)">
                                        {{ monitor.uptime7d }}%
                                    </span>
                                </td>
                                <td>
                                    <span :class="getUptimeBadge(monitor.uptime30d)">
                                        {{ monitor.uptime30d }}%
                                    </span>
                                </td>
                                <td>
                                    <span :class="getUptimeBadge(monitor.uptime90d)">
                                        {{ monitor.uptime90d }}%
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            availabilityMatrix: this.generateMatrix(),
            monitors: [
                { 
                    id: 1, 
                    name: "BGP iCentral", 
                    currentStatus: "up",
                    uptime24h: 94.74, 
                    uptime7d: 94.74, 
                    uptime30d: 94.74, 
                    uptime90d: 94.74 
                },
                { 
                    id: 2, 
                    name: "BGP4 Sparkle Local", 
                    currentStatus: "up",
                    uptime24h: 100, 
                    uptime7d: 100, 
                    uptime30d: 100, 
                    uptime90d: 100 
                },
                { 
                    id: 3, 
                    name: "BGPv4 Sparkle Gw", 
                    currentStatus: "up",
                    uptime24h: 100, 
                    uptime7d: 100, 
                    uptime30d: 100, 
                    uptime90d: 100 
                },
                { 
                    id: 4, 
                    name: "BGPv4 Zayo Gw", 
                    currentStatus: "up",
                    uptime24h: 100, 
                    uptime7d: 100, 
                    uptime30d: 100, 
                    uptime90d: 100 
                },
                { 
                    id: 5, 
                    name: "BGPv6 Zayo Local", 
                    currentStatus: "down",
                    uptime24h: 0, 
                    uptime7d: 0, 
                    uptime30d: 0, 
                    uptime90d: 0 
                },
                { 
                    id: 6, 
                    name: "BGPv6 Sparkle Local", 
                    currentStatus: "down",
                    uptime24h: 0, 
                    uptime7d: 0, 
                    uptime30d: 0, 
                    uptime90d: 0 
                }
            ]
        };
    },
    methods: {
        generateMatrix() {
            const matrix = [];
            const today = new Date();
            
            // Generar 13 semanas (91 días aproximadamente)
            for (let w = 12; w >= 0; w--) {
                const week = [];
                for (let d = 6; d >= 0; d--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - (w * 7 + d));
                    
                    // Simular datos de disponibilidad
                    let uptime = 95 + Math.random() * 5;
                    
                    // Algunos días con problemas específicos
                    if (Math.random() < 0.05) {
                        uptime = 80 + Math.random() * 15;
                    }
                    
                    week.push({
                        date: date.toLocaleDateString(),
                        uptime: uptime
                    });
                }
                matrix.push(week);
            }
            return matrix;
        },
        getAvailabilityClass(uptime) {
            if (uptime >= 99.9) return "availability-high";
            if (uptime >= 95) return "availability-medium";
            if (uptime > 0) return "availability-low";
            return "availability-none";
        },
        getStatusBadge(status) {
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
        getUptimeBadge(uptime) {
            return {
                "badge": true,
                "bg-success": uptime >= 99,
                "bg-warning": uptime >= 95 && uptime < 99,
                "bg-danger": uptime < 95
            };
        }
    }
};
</script>

<style scoped>
.availability-report {
    padding: 20px;
}

.availability-grid {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 20px 0;
}

.week-row {
    display: flex;
    gap: 3px;
}

.day-cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    cursor: pointer;
    transition: transform 0.2s;
}

.day-cell:hover {
    transform: scale(1.5);
    z-index: 10;
    position: relative;
}

.availability-high {
    background-color: #198754;
}

.availability-medium {
    background-color: #ffc107;
}

.availability-low {
    background-color: #dc3545;
}

.availability-none {
    background-color: #e9ecef;
}

.legend {
    font-size: 0.9rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    display: inline-block;
}

.card {
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.table td {
    vertical-align: middle;
}

@media (max-width: 768px) {
    .availability-report {
        padding: 10px;
    }
    
    .legend {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .legend-item {
        margin-bottom: 5px;
    }
    
    .day-cell {
        width: 10px;
        height: 10px;
    }
}
</style>
