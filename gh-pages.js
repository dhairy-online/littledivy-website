let pages = require("gh-pages");

pages.publish(
  "public", // path to public directory
  {
    branch: "pages",
    repo: "https://github.com/dhairy-online/littledivy-website.git", // Update to point to your repository
    user: {
      name: "dhairy-online", // update to use your name
      email: "dhairysrivastava5@gmail.com", // Update to use your email
    },
  },
  (branch) => {
    console.log(branch);
  }
);
