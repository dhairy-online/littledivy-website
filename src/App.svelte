
<svelte:head>
	<title>littledivy</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
      rel="stylesheet"
    />
</svelte:head>
<main class="p-10 pt-20 container sm:px-56 sm:pt-40 2xl:pt-56 2xl:p-20 2xl:px-64">
	<h1 class="text-4xl text-purple-200 pb-10 xl:text-5xl 2xl:text-6xl">Hey there, I'm <span class="text-indigo-500">divy</span>!</h1>
<div class="mockup-code max-w-lg bg-gray-800 2xl:text-2xl xl:text-lg 2xl:max-w-xl 2xl:h-64">
	<pre data-prefix="$">
		<code>whoami</code>
	</pre>
	<pre data-prefix="">
		<code class="text-purple-200 hover:text-purple-300 transition" onclick="window.location = 'https://github.com/littledivy'">divy</code>
	</pre>
	<pre data-prefix="$">
		<code>cat about.md</code>
	</pre>
	<pre data-prefix="">
		<code class="text-purple-200">
		17 | Contributing to @denoland.
		Rust, Go and Typescript.
		</code>
	</pre>
</div>
<footer class="pt-10 footer footer-center">
	<div class="flex">
		<a href="https://resume.divy.work" class="pr-5"><img src="./book.svg" alt="resume"/></a>
		<a href="https://github.com/littledivy" class="pr-5"><img src="./github.svg" alt="github" /></a>
		<a href="mailto:dj.srivastava23@gmail.com" class="pr-5"><img src="./mail.svg" alt="mail" /></a>
		<a href="https://twitter.com/undefined_void" class="pr-5"><img src="./twitter.svg" alt="twitter"/></a>
	</div>
	
  </footer>
</main>


<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
  </style>