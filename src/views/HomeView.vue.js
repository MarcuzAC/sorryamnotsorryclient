import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { publicAPI } from '@/api/client';
const router = useRouter();
const articles = ref([]);
const reports = ref([]);
const articlesLoading = ref(true);
const reportsLoading = ref(true);
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
    // Save to backend
    try {
        await publicAPI.saveVentingMessage({ message: userMessage });
    }
    catch (e) {
        console.log('Failed to save message');
    }
    // Simulate bot response
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
onMounted(async () => {
    // Fetch articles
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
    // Fetch reports
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
    // Initialize chat
    chatMessages.value.push({ type: 'bot', text: "Welcome to the Venting Room. I'm here to listen and support you. How are you feeling today?" });
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.scrollTo('home');
            // @ts-ignore
            [scrollTo,];
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
__VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
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
                    __VLS_ctx.$router.push(`/articles/${article.id}`);
                    // @ts-ignore
                    [$router, articlesLoading, articles, articles,];
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
            __VLS_ctx.$router.push('/articles');
            // @ts-ignore
            [$router,];
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
            __VLS_ctx.$router.push('/reports');
            // @ts-ignore
            [$router,];
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
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
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
            ...{ style: ({ backgroundColor: msg.type === 'user' ? '#DCF8C6' : 'white', padding: '10px 15px', borderRadius: '10px', maxWidth: '250px', wordWrap: 'break-word' }) },
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
}
// @ts-ignore
[isTyping, handleChatKeyPress, chatInput, sendChatMessage,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=HomeView.vue.js.map