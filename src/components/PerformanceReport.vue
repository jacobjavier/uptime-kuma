<template>
    <div class="performance-report">
        <!-- Métricas de rendimiento -->
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h6 class="card-subtitle mb-2 text-muted">Tiempo de Respuesta Promedio</h6>
                        <h3 class="card-title text-primary">{{ avgResponseTime }}ms</h3>
                        <small class="text-success">
                            <font-awesome-icon icon="arrow-down" /> 12% vs último período
                        </small>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h6 class="card-subtitle mb-2 text-muted">Tiempo de Respuesta P95</h6>
                        <h3 class="card-title text-warning">{{ p95ResponseTime }}ms</h3>
                        <small class="text-warning">
                            <font-awesome-icon icon="arrow-up" /> 5% vs último período
                        </small>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h6 class="card-subtitle mb-2 text-muted">Tiempo Máximo</h6>
                        <h3 class="card-title text-danger">{{ maxResponseTime }}ms</h3>
                        <small class="text-danger">
                            <font-awesome-icon icon="arrow-up" /> 20% vs último período
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla de rendimiento por monitor -->
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    <font-awesome-icon icon="tachometer-alt" class="me-2" />
                    Rendimiento por Monitor
                </h5>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Monitor</th>
                                <th>Estado</th>
                                <th>Tiempo Promedio</th>
                                <th>Último Ping</th>
                                <th>Disponibilidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="monitor in monitors" :key="monitor.id">
                                <td>
                                    <strong>{{ monitor.name }}</strong>
                                </td>
                                <td>
                                    <span :class="getStatusClass(monitor.status)">
                                        {{ getStatusText(monitor.status) }}
                                    </span>
                                </td>
                                <td>{{ monitor.avgTime }}ms</td>
                                <td>{{ monitor.lastPing }}ms</td>
                                <td>
                                    <div class="progress" style="height: 20px;">
                                        <div 
                                            class="progress-bar" 
                                            :class="getProgressClass(monitor.uptime)"
                                            :style="{ width: monitor.uptime + '%' }"
                                        >
                                            {{ monitor.uptime }}%
                                        </div>
                                    </div>
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
            avgResponseTime: 245,
            p95ResponseTime: 520,
            maxResponseTime: 1250,
            monitors: [
                {
                    id: 1,
                    name: "BGP iCentral",
                    status: "up",
                    avgTime: 156,
                    lastPing: 142,
                    uptime: 94.74
                },
                {
                    id: 2,
                    name: "BGP4 Sparkle Local",
                    status: "up", 
                    avgTime: 89,
                    lastPing: 95,
                    uptime: 100
                },
                {
                    id: 3,
                    name: "BGPv4 Sparkle Gw",
                    status: "up",
                    avgTime: 112,
                    lastPing: 108,
                    uptime: 100
                },
                {
                    id: 4,
                    name: "BGPv4 Zayo Gw",
                    status: "up",
                    avgTime: 134,
                    lastPing: 129,
                    uptime: 100
                },
                {
                    id: 5,
                    name: "BGPv6 Zayo Local",
                    status: "down",
                    avgTime: 0,
                    lastPing: 0,
                    uptime: 0
                },
                {
                    id: 6,
                    name: "BGPv6 Sparkle Local",
                    status: "down",
                    avgTime: 0,
                    lastPing: 0,
                    uptime: 0
                }
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
        getProgressClass(uptime) {
            if (uptime >= 99) return "bg-success";
            if (uptime >= 95) return "bg-warning";
            return "bg-danger";
        }
    }
};
</script>

<style scoped>
.performance-report {
    padding: 20px;
}

.card {
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.progress {
    background-color: #e9ecef;
}

.table td {
    vertical-align: middle;
}

@media (max-width: 768px) {
    .performance-report {
        padding: 10px;
    }
}
</style>
