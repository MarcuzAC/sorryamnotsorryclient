import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { publicAPI } from '@/api/client';
const router = useRouter();
const articles = ref([]);
const loading = ref(true);
const truncate = (text, length) => {
    if (!text)
        return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};
onMounted(async () => {
    try {
        const res = await publicAPI.getArticles(0, 100);
        articles.value = res.data;
    }
    catch (error) {
        console.error('Failed to load articles');
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
else if (__VLS_ctx.articles.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    for (const [article] of __VLS_vFor((__VLS_ctx.articles))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.articles.length === 0))
                        return;
                    __VLS_ctx.router.push(`/articles/${article.id}`);
                    // @ts-ignore
                    [loading, articles, articles, router,];
                } },
            key: (article.id),
            ...{ style: {} },
        });
        if (article.image_url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: ({ height: '220px', backgroundImage: `url(${article.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }) },
            });
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ style: {} },
        });
        (article.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ style: {} },
        });
        (__VLS_ctx.truncate(article.subtitle || article.content, 120));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
        });
        (article.author);
        (new Date(article.created_at).toLocaleDateString());
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
        });
        // @ts-ignore
        [truncate,];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=ArticlesView.vue.js.map