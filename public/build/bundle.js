var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e){t.appendChild(e)}function i(t,e,n){t.insertBefore(e,n||null)}function a(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function u(){return t=" ",document.createTextNode(t);var t}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let d;function f(t){d=t}const m=[],h=[],g=[],$=[],b=Promise.resolve();let x=!1;function y(t){g.push(t)}let v=!1;const _=new Set;function k(){if(!v){v=!0;do{for(let t=0;t<m.length;t+=1){const e=m[t];f(e),w(e.$$)}for(f(null),m.length=0;h.length;)h.pop()();for(let t=0;t<g.length;t+=1){const e=g[t];_.has(e)||(_.add(e),e())}g.length=0}while(m.length);for(;$.length;)$.pop()();x=!1,v=!1,_.clear()}}function w(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(y)}}const E=new Set;function A(t,e){-1===t.$$.dirty[0]&&(m.push(t),x||(x=!0,b.then(k)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function j(c,s,i,l,u,p,m,h=[-1]){const g=d;f(c);const $=c.$$={fragment:null,ctx:null,props:p,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(g?g.$$.context:[])),callbacks:n(),dirty:h,skip_bound:!1,root:s.target||g.$$.root};m&&m($.root);let b=!1;if($.ctx=i?i(c,s.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return $.ctx&&u($.ctx[t],$.ctx[t]=o)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](o),b&&A(c,t)),e})):[],$.update(),b=!0,o($.before_update),$.fragment=!!l&&l($.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);$.fragment&&$.fragment.l(t),t.forEach(a)}else $.fragment&&$.fragment.c();s.intro&&((x=c.$$.fragment)&&x.i&&(E.delete(x),x.i(v))),function(t,n,c,s){const{fragment:i,on_mount:a,on_destroy:l,after_update:u}=t.$$;i&&i.m(n,c),s||y((()=>{const n=a.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(y)}(c,s.target,s.anchor,s.customElement),k()}var x,v;f(g)}function C(e){let n,o,r,c,d;return{c(){n=l("link"),o=l("link"),r=l("link"),c=u(),d=l("main"),d.innerHTML='<h1 class="text-4xl text-purple-200 pb-10">Hey there, I&#39;m <span class="text-indigo-500">divy</span> !</h1> \n<div class="mockup-code max-w-lg bg-gray-800"><pre data-prefix="$"><code>whoami</code></pre> \n\t<pre data-prefix=""><code class="text-purple-200 hover:text-purple-300 transition" onclick="window.location = &#39;https://github.com/littledivy&#39;">divy</code></pre> \n\t<pre data-prefix="$"><code>cat about.md</code></pre> \n\t<pre data-prefix=""><code class="text-purple-200">17 | Contributing to @denoland.\n\t\tRust, Go and Typescript.</code></pre></div> \n<footer class="pt-10 footer footer-center"><div class="flex "><img src="./book.svg" alt="resume" class="pr-5"/> \n\t\t<img src="./github.svg" alt="github" class="pr-5"/> \n\t\t<img src="./mail.svg" alt="mail" class="pr-5"/> \n\t\t<img src="./twitter.svg" alt="twitter" class="pr-5"/></div></footer>',p(n,"rel","preconnect"),p(n,"href","https://fonts.googleapis.com"),p(o,"rel","preconnect"),p(o,"href","https://fonts.gstatic.com"),p(o,"crossorigin",""),p(r,"href","https://fonts.googleapis.com/css2?family=Poppins&display=swap"),p(r,"rel","stylesheet"),p(d,"class","p-10 pt-20 container sm:px-56 sm:pt-40")},m(t,e){s(document.head,n),s(document.head,o),s(document.head,r),i(t,c,e),i(t,d,e)},p:t,i:t,o:t,d(t){a(n),a(o),a(r),t&&a(c),t&&a(d)}}}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),j(this,t,null,C,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
