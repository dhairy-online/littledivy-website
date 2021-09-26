
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.43.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let link0;
    	let link1;
    	let link2;
    	let t0;
    	let main;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let t4;
    	let div0;
    	let pre0;
    	let code0;
    	let t6;
    	let pre1;
    	let code1;
    	let t8;
    	let pre2;
    	let code2;
    	let t10;
    	let pre3;
    	let code3;
    	let t12;
    	let footer;
    	let div1;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t13;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t14;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t15;
    	let a3;
    	let img3;
    	let img3_src_value;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			t1 = text("Hey there, I'm ");
    			span = element("span");
    			span.textContent = "divy";
    			t3 = text("!");
    			t4 = space();
    			div0 = element("div");
    			pre0 = element("pre");
    			code0 = element("code");
    			code0.textContent = "whoami";
    			t6 = space();
    			pre1 = element("pre");
    			code1 = element("code");
    			code1.textContent = "divy";
    			t8 = space();
    			pre2 = element("pre");
    			code2 = element("code");
    			code2.textContent = "cat about.md";
    			t10 = space();
    			pre3 = element("pre");
    			code3 = element("code");
    			code3.textContent = "17 | Contributing to @denoland.\n\t\tRust, Go and Typescript.";
    			t12 = space();
    			footer = element("footer");
    			div1 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t13 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t14 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t15 = space();
    			a3 = element("a");
    			img3 = element("img");
    			attr_dev(link0, "rel", "preconnect");
    			attr_dev(link0, "href", "https://fonts.googleapis.com");
    			add_location(link0, file, 2, 1, 16);
    			attr_dev(link1, "rel", "preconnect");
    			attr_dev(link1, "href", "https://fonts.gstatic.com");
    			attr_dev(link1, "crossorigin", "");
    			add_location(link1, file, 3, 4, 82);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css2?family=Poppins&display=swap");
    			attr_dev(link2, "rel", "stylesheet");
    			add_location(link2, file, 4, 4, 157);
    			attr_dev(span, "class", "text-indigo-500");
    			add_location(span, file, 10, 84, 450);
    			attr_dev(h1, "class", "text-4xl text-purple-200 pb-10 xl:text-5xl 2xl:text-6xl");
    			add_location(h1, file, 10, 1, 367);
    			add_location(code0, file, 13, 2, 616);
    			attr_dev(pre0, "data-prefix", "$");
    			add_location(pre0, file, 12, 1, 592);
    			attr_dev(code1, "class", "text-purple-200 hover:text-purple-300 transition");
    			attr_dev(code1, "onclick", "window.location = 'https://github.com/littledivy'");
    			add_location(code1, file, 16, 2, 668);
    			attr_dev(pre1, "data-prefix", "");
    			add_location(pre1, file, 15, 1, 645);
    			add_location(code2, file, 19, 2, 836);
    			attr_dev(pre2, "data-prefix", "$");
    			add_location(pre2, file, 18, 1, 812);
    			attr_dev(code3, "class", "text-purple-200");
    			add_location(code3, file, 22, 2, 894);
    			attr_dev(pre3, "data-prefix", "");
    			add_location(pre3, file, 21, 1, 871);
    			attr_dev(div0, "class", "mockup-code max-w-lg bg-gray-800 2xl:text-2xl xl:text-lg 2xl:max-w-xl 2xl:h-64");
    			add_location(div0, file, 11, 0, 498);
    			if (!src_url_equal(img0.src, img0_src_value = "./book.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "resume");
    			add_location(img0, file, 30, 50, 1125);
    			attr_dev(a0, "href", "https://resume.divy.work");
    			attr_dev(a0, "class", "pr-5");
    			add_location(a0, file, 30, 2, 1077);
    			if (!src_url_equal(img1.src, img1_src_value = "./github.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "github");
    			add_location(img1, file, 31, 55, 1221);
    			attr_dev(a1, "href", "https://github.com/littledivy");
    			attr_dev(a1, "class", "pr-5");
    			add_location(a1, file, 31, 2, 1168);
    			if (!src_url_equal(img2.src, img2_src_value = "./mail.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "mail");
    			add_location(img2, file, 32, 58, 1323);
    			attr_dev(a2, "href", "mailto:dj.srivastava23@gmail.com");
    			attr_dev(a2, "class", "pr-5");
    			add_location(a2, file, 32, 2, 1267);
    			if (!src_url_equal(img3.src, img3_src_value = "./twitter.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "twitter");
    			add_location(img3, file, 33, 60, 1423);
    			attr_dev(a3, "href", "https://twitter.com/undefined_void");
    			attr_dev(a3, "class", "pr-5");
    			add_location(a3, file, 33, 2, 1365);
    			attr_dev(div1, "class", "flex");
    			add_location(div1, file, 29, 1, 1056);
    			attr_dev(footer, "class", "pt-10 footer footer-center");
    			add_location(footer, file, 28, 0, 1011);
    			attr_dev(main, "class", "p-10 pt-20 container sm:px-56 sm:pt-40 2xl:pt-56 2xl:p-20 2xl:px-64");
    			add_location(main, file, 9, 0, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			append_dev(document.head, link2);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, span);
    			append_dev(h1, t3);
    			append_dev(main, t4);
    			append_dev(main, div0);
    			append_dev(div0, pre0);
    			append_dev(pre0, code0);
    			append_dev(div0, t6);
    			append_dev(div0, pre1);
    			append_dev(pre1, code1);
    			append_dev(div0, t8);
    			append_dev(div0, pre2);
    			append_dev(pre2, code2);
    			append_dev(div0, t10);
    			append_dev(div0, pre3);
    			append_dev(pre3, code3);
    			append_dev(main, t12);
    			append_dev(main, footer);
    			append_dev(footer, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img0);
    			append_dev(div1, t13);
    			append_dev(div1, a1);
    			append_dev(a1, img1);
    			append_dev(div1, t14);
    			append_dev(div1, a2);
    			append_dev(a2, img2);
    			append_dev(div1, t15);
    			append_dev(div1, a3);
    			append_dev(a3, img3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(link2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
