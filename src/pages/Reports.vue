<template>
    <transition name="slide-fade" appear>
        <div v-if="$root.loggedIn">
            <h1 class="mb-4">
                <font-awesome-icon icon="chart-line" /> Centro de Reportes
            </h1>

            <!-- Tabs para diferentes tipos de reportes -->
            <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item">
                    <a 
                        class="nav-link" 
                        :class="{ active: activeTab === 'downtime' }"
                        @click="activeTab = 'downtime'"
                        role="tab"
                    >
                        <font-awesome-icon icon="exclamation-triangle" /> 
                        Reporte de Downtime
                    </a>
                </li>
                <li class="nav-item">
                    <a 
                        class="nav-link" 
                        :class="{ active: activeTab === 'performance' }"
                        @click="activeTab = 'performance'"
                        role="tab"
                    >
                        <font-awesome-icon icon="tachometer-alt" /> 
                        Rendimiento
                    </a>
                </li>
                <li class="nav-item">
                    <a 
                        class="nav-link" 
                        :class="{ active: activeTab === 'availability' }"
                        @click="activeTab = 'availability'"
                        role="tab"
                    >
                        <font-awesome-icon icon="check-circle" /> 
                        Disponibilidad
                    </a>
                </li>
            </ul>

            <!-- Contenido de tabs -->
            <div class="tab-content">
                <!-- Tab de Downtime -->
                <div v-if="activeTab === 'downtime'" class="tab-pane fade show active">
                    <DowntimeReport :monitor-id="selectedMonitorId" />
                </div>

                <!-- Tab de Rendimiento -->
                <div v-if="activeTab === 'performance'" class="tab-pane fade show active">
                    <PerformanceReport :monitor-id="selectedMonitorId" />
                </div>

                <!-- Tab de Disponibilidad -->
                <div v-if="activeTab === 'availability'" class="tab-pane fade show active">
                    <AvailabilityReport :monitor-id="selectedMonitorId" />
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import DowntimeReport from "../components/DowntimeReport.vue";
import PerformanceReport from "../components/PerformanceReport.vue";
import AvailabilityReport from "../components/AvailabilityReport.vue";

export default {
    components: {
        DowntimeReport,
        PerformanceReport,
        AvailabilityReport
    },
    data() {
        return {
            activeTab: "downtime",
            selectedMonitorId: null
        };
    },
    mounted() {
        // Obtener monitor ID de los parámetros de ruta si existe
        if (this.$route.params.monitorId) {
            this.selectedMonitorId = parseInt(this.$route.params.monitorId);
        }
    }
};
</script>

<style scoped>
.nav-tabs .nav-link {
    cursor: pointer;
    color: #6c757d;
}

.nav-tabs .nav-link.active {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
}

.nav-tabs .nav-link:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
}

.tab-content {
    background: transparent;
    padding: 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
}
</style>
