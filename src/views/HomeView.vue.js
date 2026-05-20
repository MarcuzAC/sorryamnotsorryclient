import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { publicAPI } from '@/api/client';
// Import logo and background images
import logo from '@/assets/images/logo.png';
import heroBg1 from '@/assets/images/hero1.jpg';
import heroBg2 from '@/assets/images/hero2.jpg';
import heroBg3 from '@/assets/images/hero3.jpg';
import heroBg4 from '@/assets/images/hero4.jpg';
import heroBg5 from '@/assets/images/hero5.jpg';
const router = useRouter();
const articles = ref([]);
const reports = ref([]);
const articlesLoading = ref(true);
const reportsLoading = ref(true);
const currentSlide = ref(0);
// Hero slides
const heroSlides = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5];
// Contact form
const contactForm = ref({ name: '', email: '', message: '' });
const contactSubmitting = ref(false);
// Chat
const chatOpen = ref(false);
const chatMessages = ref([]);
const chatInput = ref('');
const isTyping = ref(false);
const truncate = (text, length) => {
    if (!text)
        return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};
const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element)
        element.scrollIntoView({ behavior: 'smooth' });
};
const downloadReport = async (id, url) => {
    try {
        await publicAPI.downloadReport(id);
        window.open(url, '_blank');
    }
    catch (error) {
        alert('Download failed. Please try again.');
    }
};
const submitContact = async () => {
    if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
        alert('Please fill in all fields');
        return;
    }
    contactSubmitting.value = true;
    try {
        await publicAPI.submitContact(contactForm.value);
        alert('Message sent successfully!');
        contactForm.value = { name: '', email: '', message: '' };
    }
    catch (error) {
        alert('Failed to send message. Please try again.');
    }
    finally {
        contactSubmitting.value = false;
    }
};
const sendChatMessage = async () => {
    if (!chatInput.value.trim())
        return;
    const userMessage = chatInput.value.trim();
    chatMessages.value.push({ type: 'user', text: userMessage });
    chatInput.value = '';
    isTyping.value = true;
    try {
        await publicAPI.saveVentingMessage({ message: userMessage });
    }
    catch (e) {
        console.log('Failed to save message');
    }
    setTimeout(() => {
        let response = "Thank you for sharing. I hear you. Would you like to:\n\n1. Talk to a counselor\n2. Get mental health resources\n3. Speak to a human\n\nType the number of your choice.";
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('1') || lowerMsg.includes('counselor')) {
            response = "I'll connect you with a trained counselor. Please share your name and preferred time for a call.";
        }
        else if (lowerMsg.includes('2') || lowerMsg.includes('resource')) {
            response = "Here are some resources:\n\n• Breathing exercises\n• Grounding techniques\n• Self-care tips\n\nYou can also call our helpline: +265 998 896 206";
        }
        else if (lowerMsg.includes('3') || lowerMsg.includes('human')) {
            response = "A human advocate will respond shortly. Please leave your phone number.";
        }
        else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = "Hello! Welcome to the Venting Room. How are you feeling today?";
        }
        chatMessages.value.push({ type: 'bot', text: response });
        isTyping.value = false;
    }, 1000);
};
const handleChatKeyPress = (e) => {
    if (e.key === 'Enter')
        sendChatMessage();
};
// Auto-slide
let slideInterval;
onMounted(async () => {
    slideInterval = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % heroSlides.length;
    }, 5000);
    try {
        const res = await publicAPI.getArticles(0, 3);
        articles.value = res.data;
    }
    catch (error) {
        console.error('Failed to load articles');
    }
    finally {
        articlesLoading.value = false;
    }
    try {
        const res = await publicAPI.getReports();
        reports.value = res.data;
    }
    catch (error) {
        console.error('Failed to load reports');
    }
    finally {
        reportsLoading.value = false;
    }
    chatMessages.value.push({ type: 'bot', text: "Welcome to the Venting Room. I'm here to listen and support you. How are you feeling today?" });
});
// Cleanup
onMounted(() => {
    return () => {
        if (slideInterval)
            clearInterval(slideInterval);
    };
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('home');
            // @ts-ignore
            [scrollTo,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.logo),
    alt: "Logo",
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('home');
            // @ts-ignore
            [scrollTo, logo,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('articles');
            // @ts-ignore
            [scrollTo,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('reports');
            // @ts-ignore
            [scrollTo,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('contact');
            // @ts-ignore
            [scrollTo,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/reports');
            // @ts-ignore
            [$router,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    id: "home",
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
for (const [slide, index] of __VLS_vFor((__VLS_ctx.heroSlides))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (index),
        ...{ style: ({ flex: '0 0 100%', height: '100%', backgroundImage: `url(${slide})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }) },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    // @ts-ignore
    [heroSlides,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('articles');
            // @ts-ignore
            [scrollTo,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/reports');
            // @ts-ignore
            [$router,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.chatOpen = true;
            // @ts-ignore
            [chatOpen,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
for (const [_, index] of __VLS_vFor((__VLS_ctx.heroSlides))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.currentSlide = index;
                // @ts-ignore
                [heroSlides, currentSlide,];
            } },
        key: (index),
        ...{ style: ({ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: __VLS_ctx.currentSlide === index ? '#2563eb' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }) },
    });
    // @ts-ignore
    [currentSlide,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    id: "articles",
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
if (__VLS_ctx.articlesLoading) {
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
                    if (!!(__VLS_ctx.articlesLoading))
                        return;
                    if (!!(__VLS_ctx.articles.length === 0))
                        return;
                    __VLS_ctx.router.push(`/articles/${article.id}`);
                    // @ts-ignore
                    [articlesLoading, articles, articles, router,];
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
            __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
                width: "60",
                height: "60",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "white",
                'stroke-width': "1.5",
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
                d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
                d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
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
        (__VLS_ctx.truncate(article.subtitle || article.content, 100));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/articles');
            // @ts-ignore
            [router,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    id: "reports",
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
if (__VLS_ctx.reportsLoading) {
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
    for (const [report] of __VLS_vFor((__VLS_ctx.reports.slice(0, 3)))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (report.id),
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
            width: "50",
            height: "50",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#2563eb",
            'stroke-width': "1.5",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
            d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
            points: "14 2 14 8 20 8",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
            x1: "16",
            y1: "13",
            x2: "8",
            y2: "13",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
            x1: "16",
            y1: "17",
            x2: "8",
            y2: "17",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
            points: "10 9 9 9 8 9",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
            ...{ style: {} },
        });
        (report.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ style: {} },
        });
        (report.description || 'Download our latest report on mental health initiatives');
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.reportsLoading))
                        return;
                    if (!!(__VLS_ctx.reports.length === 0))
                        return;
                    __VLS_ctx.downloadReport(report.id, report.file_url);
                    // @ts-ignore
                    [reportsLoading, reports, reports, downloadReport,];
                } },
            ...{ style: {} },
        });
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.router.push('/reports');
            // @ts-ignore
            [router,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    id: "contact",
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.submitContact) },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    value: (__VLS_ctx.contactForm.name),
    type: "text",
    placeholder: "Your Name",
    required: true,
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "email",
    placeholder: "Your Email",
    required: true,
    ...{ style: {} },
});
(__VLS_ctx.contactForm.email);
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)({
    value: (__VLS_ctx.contactForm.message),
    placeholder: "Your Message",
    rows: "5",
    required: true,
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    disabled: (__VLS_ctx.contactSubmitting),
    ...{ style: {} },
});
(__VLS_ctx.contactSubmitting ? 'Sending...' : 'Send Message');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#2563eb",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#2563eb",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "22,6 12,13 2,6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.chatOpen = !__VLS_ctx.chatOpen;
            // @ts-ignore
            [chatOpen, chatOpen, submitContact, contactForm, contactForm, contactForm, contactSubmitting, contactSubmitting,];
        } },
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
});
if (__VLS_ctx.chatOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.chatOpen))
                    return;
                __VLS_ctx.chatOpen = false;
                // @ts-ignore
                [chatOpen, chatOpen,];
            } },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    for (const [msg, idx] of __VLS_vFor((__VLS_ctx.chatMessages))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (idx),
            ...{ style: ({ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start' }) },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: ({ backgroundColor: msg.type === 'user' ? '#2563eb' : 'white', color: msg.type === 'user' ? 'white' : '#333', padding: '10px 15px', borderRadius: '10px', maxWidth: '250px', wordWrap: 'break-word' }) },
        });
        (msg.text);
        // @ts-ignore
        [chatMessages,];
    }
    if (__VLS_ctx.isTyping) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ onKeypress: (__VLS_ctx.handleChatKeyPress) },
        value: (__VLS_ctx.chatInput),
        type: "text",
        placeholder: "Type your message...",
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.sendChatMessage) },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "22",
        y1: "2",
        x2: "11",
        y2: "13",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polygon)({
        points: "22 2 15 22 11 13 2 9 22 2",
    });
}
// @ts-ignore
[isTyping, handleChatKeyPress, chatInput, sendChatMessage,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=HomeView.vue.js.map