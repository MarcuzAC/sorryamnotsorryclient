import { ref, onMounted } from 'vue';
import { publicAPI } from '@/api/client';
const reports = ref([]);
const loading = ref(true);
const downloadReport = async (id, url) => {
    try {
        await publicAPI.downloadReport(id);
        window.open(url, '_blank');
    }
    catch (error) {
        alert('Download failed. Please try again.');
    }
};
onMounted(async () => {
    try {
        const res = await publicAPI.getReports();
        reports.value = res.data;
    }
    catch (error) {
        console.error('Failed to load reports');
    }
    finally {
        loading.value = false;
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
}
else if (__VLS_ctx.reports.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    for (const [report] of __VLS_vFor((__VLS_ctx.reports))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (report.id),
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ style: {} },
        });
        (report.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ style: {} },
        });
        (report.description || 'Download our latest report on mental health initiatives');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        (new Date(report.created_at).toLocaleDateString());
        (report.download_count);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.reports.length === 0))
                        return;
                    __VLS_ctx.downloadReport(report.id, report.file_url);
                    // @ts-ignore
                    [loading, reports, reports, downloadReport,];
                } },
            ...{ style: {} },
        });
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=ReportsView.vue.js.map