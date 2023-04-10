<style>
  p {font-size: 150%;}
</style>

I've been working on customizing my Neovim setup for quite sometime now,
and I have been itching for a project that I can hone in my keyboard skills
and muscle memory of this text editor. One evening, my son and I were
discussing merge sort and how the algorithm can be augmented without changing
the original data elements. He told me it was part of his new
[assignment](../lesson/instructions.pdf).

Long story short, I decided this assignment would be a good trial for my new
Neovim setup. Not going to lie. I think I was more excited than my son on
this assignment.

I created my merge sort, debugging it using Neovim, and its corresponding
`nivm-dap-vscode-js` DAP adapter plugin, and the `vscode-js-debug`. The
experience was okay and on par with Visual Studio Code on the same HW
platform. However, I liked the fact that I was able to debug it even
through `ssh`.

As the old saying goes, no software project is ever completed, we just know
when to stop. I decided to end my exploration of Neovim here, culminated in
this little handy [web site](../) that can explore the IMDB data quite
nicely. I especially liked my visual interpretation of the Six Degrees of
Kevin Bacon. I did not follow the instructions verbatim, rather applied the
spirit of the original requirements and applied my own interpretation of the
look and feel of the final rendition.

I skipped the **Hit List** concept, as I thought without a proper persistent backend,
the user could have simply used the browser bookmarks to the end IMDB links
which are way more resourceful than anything I could cook up in the
short term.

I put some source code documentation on my **Merge Sort** and **Searching**
algorithms. I also commented on my technique of the **Actor Connection**
algorithm. All of which were inlined with JSDOC and can be accessed with
the menu on the right of this page.

Here is a quick demo of its navigation and capabilities:

<iframe width="800" height="450"
  src="https://www.youtube.com/embed/kswen_UclCw"
  title="YouTube video player" frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen></iframe>
