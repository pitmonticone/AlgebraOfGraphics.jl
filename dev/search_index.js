var documenterSearchIndex = {"docs":
[{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"EditURL = \"https://github.com/JuliaPlots/AlgebraOfGraphics.jl/blob/master/docs/src/generated/internals.jl\"","category":"page"},{"location":"generated/internals/#Internals-1","page":"Internals","title":"Internals","text":"","category":"section"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"AlgebraOfGraphics is based on contexts, which can be extended. Each context contains a named tuple data (used for x, y axes or attributes in the plot) and a named tuple primary used for grouping.","category":"page"},{"location":"generated/internals/#Contexts-1","page":"Internals","title":"Contexts","text":"","category":"section"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"In the default context, all variables in data are broadcasted to a common shape, and each entry correspond to a separate trace. The syntax dims exists to allow setting primary variables that only vary with one of the dimensions.","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"using RDatasets: dataset\nusing AlgebraOfGraphics: table, data, primary\nd = data(:Cyl, :Hwy) |> primary(color = :Year)\nd.primary","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"The primary => data pairs corresponding to each group can be accessed with Base.pairs:","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"pairs(d.primary)","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"The DataContext is invoked with table(df), where df respects the Tables.jl interface. DefaultContexts can be merged onto a DataContext (column names are replaced by the corresponding arrays).","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"mpg = dataset(\"ggplot2\", \"mpg\")\nt = table(mpg)\npairs(t |> d)","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"The SliceContext is another example. It is inoked with slice(I::Int...), and signals along which dimension on the data to slice to extract series.","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"using AlgebraOfGraphics: slice, dims\nctx = slice(1)\nx = rand(5, 3, 2)\ny = rand(5, 3)\npairs(slice(1) |> data(x, y) |> primary(color=dims(2), marker=dims(3)))","category":"page"},{"location":"generated/internals/#Combining-operations-using-trees-1","page":"Internals","title":"Combining operations using trees","text":"","category":"section"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"Under the hood, DefaultContext, DataContext, and SliceContext all inherit from (oriented) AbstractEdge. AbstractEdges (and more generally Trees) can be combined using + (join at the root), or * (attach the root of one at the leaf of the other).","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"mpg1 = copy(mpg)\nmpg1.Displ = mpg.Displ .* 0.1\ntree = (table(mpg) + table(mpg1)) * data(:Hwy, :Displ) * primary(color=:Cyl)","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"The resulting Tree is a lazy representation of the operations to be performed. One can inspect the results by calling","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"using AlgebraOfGraphics: outputs\noutputs(tree)","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"or even","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"using AbstractPlotting, CairoMakie, MakieLayout\nusing AlgebraOfGraphics: spec, draw\ntree * spec(Scatter, markersize=10px) |> draw\nAbstractPlotting.save(\"tree.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"(Image: )","category":"page"},{"location":"generated/internals/#Implementing-a-new-context-1","page":"Internals","title":"Implementing a new context","text":"","category":"section"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"To implement a new context, one needs to:","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"inherit from AbstractEdge (to support + and * operations),\ndefine a method (s2::DefaultContext)(s1::MyContext) (to allow applying primary and data to MyContext),\ndefine Base.pairs(s::MyContext), which iterates primary => data pairs.","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"See example implementation in the context file.","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"","category":"page"},{"location":"generated/internals/#","page":"Internals","title":"Internals","text":"This page was generated using Literate.jl.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"EditURL = \"https://github.com/JuliaPlots/AlgebraOfGraphics.jl/blob/master/docs/src/generated/tutorial.jl\"","category":"page"},{"location":"generated/tutorial/#Tutorial-1","page":"Tutorial","title":"Tutorial","text":"","category":"section"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"Below are some examples on how to use AlgebraOfGraphics to create plots based on tables or other data formats. The most important functions are primary, data, and spec. They generate AbstractEdge objects, whic can be combined into trees with * (vertical composition), or + (horizontal composition). The resulting Tree can then be plotted with a package that supports it (so far MakieLayout).","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"data determines what is the data to be plotted. Its positional arguments correspond to the x, y. or z axes of the plot, whereas the keyword arguments correspond to plot attributes that can vary continuously, such as color or markersize. primary determines the grouping of the data. The data is split according to the variables listed in primary, and then styled using a default palette. Finally spec can be used to give data-independent specifications about the plot (plotting function or attributes).","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"data, primary, and spec work in various context. In the following we will explore DataContext, which is introduced doing table(df) for any tabular data structure df. In this context, data and primary accept symbols and integers, which correspond to columns of the table.","category":"page"},{"location":"generated/tutorial/#Working-with-tables-1","page":"Tutorial","title":"Working with tables","text":"","category":"section"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"using RDatasets: dataset\nusing AbstractPlotting, CairoMakie, MakieLayout\nusing AlgebraOfGraphics: table, data, primary, spec, draw\nmpg = dataset(\"ggplot2\", \"mpg\");\ncols = data(:Displ, :Hwy);\ngrp = primary(color = :Cyl);\nscat = spec(Scatter, markersize = 10px)\npipeline = cols * scat\ntable(mpg) * pipeline |> draw\nAbstractPlotting.save(\"scatter.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"Now let's simply add grp to the pipeline to do the grouping.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"table(mpg) * grp * pipeline |> draw\nAbstractPlotting.save(\"grouped_scatter.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: ) Traces can be added together with +.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"using StatsMakie: linear\nlin = spec(linear, linewidth = 5)\npipenew = cols * (scat + lin)\ntable(mpg) * pipenew |> draw\nAbstractPlotting.save(\"linear.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: ) We can put grouping in the pipeline (we filter to avoid a degenerate group).","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"table(filter(row -> row.Cyl != 5, mpg)) * grp * pipenew |> draw\nAbstractPlotting.save(\"grouped_linear.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: ) This is a more complex example, where we split the scatter plot, but do the linear regression with all the data.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"different_grouping = grp * scat + lin\ntable(mpg) * cols * different_grouping |> draw\nAbstractPlotting.save(\"semi_grouped.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"},{"location":"generated/tutorial/#Non-tabular-data-1","page":"Tutorial","title":"Non tabular data","text":"","category":"section"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"The framework is not specific to tables, but can be used with anything that the plotting package supports.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"using AlgebraOfGraphics: dims\nx = [-pi..0, 0..pi]\ny = [sin cos] # We use broadcasting semantics on `tuple.(x, y)`.\ndata(x, y) * primary(color = dims(1), linestyle = dims(2)) * spec(linewidth = 10) |> draw\nAbstractPlotting.save(\"functions.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"using Distributions\nmus = 1:4\nshapes = [6, 10]\ngs = InverseGaussian.(mus, shapes')\ngeom = spec(linewidth = 5)\ngrp = primary(color = dims(1), linestyle = dims(2))\ndata(fill(0..5), gs) * grp * geom |> draw\nAbstractPlotting.save(\"distributions.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"},{"location":"generated/tutorial/#Layout-1","page":"Tutorial","title":"Layout","text":"","category":"section"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"Thanks to the MakieLayout package it is possible to create plots where categorical variables inform the layout.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"iris = dataset(\"datasets\", \"iris\")\ncols = data([:SepalLength, :SepalWidth], [:PetalLength :PetalWidth])\ngrp = primary(layout_x = dims(1), layout_y = dims(2), color = :Species)\ngeom = spec(Scatter, markersize = 10px) + spec(linear, linewidth = 3)\ntable(iris) * cols * grp * geom |> draw\nAbstractPlotting.save(\"layout.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"},{"location":"generated/tutorial/#Slicing-context-1","page":"Tutorial","title":"Slicing context","text":"","category":"section"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"The algebra of graphics logic can be easily extended to novel contexts. For example, slice implements the \"slices are series\" approach.","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"using AlgebraOfGraphics: slice\ns = slice(1) * data(rand(50, 3), rand(50, 3, 2))\ngrp = primary(color = dims(2), layout_x = dims(3))\ns * grp * spec(Scatter, markersize = 10px) |> draw\nAbstractPlotting.save(\"arrays.svg\", AbstractPlotting.current_scene()); nothing #hide","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"","category":"page"},{"location":"generated/tutorial/#","page":"Tutorial","title":"Tutorial","text":"This page was generated using Literate.jl.","category":"page"},{"location":"#Introduction-1","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"#","page":"Introduction","title":"Introduction","text":"AlgebraOfGraphics defines a \"plotting package agnostic\" algebra of graphics based on a few simple building blocks that can be combined using + and *.","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"This package is not yet released, but can be installed typing","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"(@v1.4) pkg> add https://github.com/JuliaPlots/AlgebraOfGraphics.jl.git","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"in the Pkg REPL.","category":"page"},{"location":"#","page":"Introduction","title":"Introduction","text":"See Tutorial for examples on how to use it. Devdocs are coming up next.","category":"page"}]
}
