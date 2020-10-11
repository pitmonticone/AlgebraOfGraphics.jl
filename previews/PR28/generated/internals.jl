# # Internals
#
# AlgebraOfGraphics is based on *contexts*, which can be extended. Each context is then
# associated to a named tuple `data` (used for `x`, `y` axes or attributes in the plot)
# and a named tuple `primary` used for grouping, forming a `ContextualPair`. A list of
# contextual pairs is called a contextual map.
#
# ## Contexts
#
# In the default context, all variables in `data` are broadcasted to a common shape, and
# each entry corresponds to a separate trace. The syntax `dims` exists to allow setting 
# `primary` variables that only vary with one of the dimensions.
# The `primary => data` pairs corresponding to each group can be accessed with `Base.pairs`:

using RDatasets: dataset
using AlgebraOfGraphics: table, data, primary
d = data(:Cyl, :Hwy) * primary(color = :Year)
pairs(d)

# The `DataContext` is invoked with `table(df)`, where `df` respects the Tables.jl interface.
# `DefaultContext`s can be merged onto a `DataContext` (column names are replaced by the
# corresponding arrays).

mpg = dataset("ggplot2", "mpg")
t = table(mpg)
pairs(t * d)

# The slicing context is another example. It is invoked with `dims(I::Int...)`, and signals
# along which dimension on the data to dims to extract series.

using AlgebraOfGraphics: dims
ctx = dims(1)
x = rand(5, 3, 2)
y = rand(5, 3)
pairs(dims(1) * data(x, y) * primary(color=dims(2), marker=dims(3)))

# ## Combining operations using trees
#
# All outputs of `primary`, `data`, `table`, and `dims` inherit can be combined using `+`
# (adding a new layer), or `*` (merge information in existing layer).

using AbstractPlotting, CairoMakie, MakieLayout
using AlgebraOfGraphics: spec
mpg1 = copy(mpg)
mpg1.Displ = mpg.Displ .* 0.1
ts = (table(mpg) * spec(markersize = 5px) + table(mpg1) * spec(markersize=10px))
sl = ts * data(:Hwy, :Displ) * primary(color=:Cyl)

# The result can then be plotted using the `draw` function:

using AlgebraOfGraphics: draw
sl * spec(Scatter) |> draw
AbstractPlotting.save("tree.svg", AbstractPlotting.current_scene()); nothing #hide

# ![](tree.svg)
#
# ## Implementing a new context
#
# To implement a new context, one can overload:
#
# - `AlgebraOfGraphics.merge_primary_data(c::ContextualPair{<:MyContext}, pd)`, to allow applying `primary` and `data` to `MyContext`,
#
# - `Base.pairs(c::ContextualPair{<:MyContext})`, which must iterates `primary::NamedTuple => data::NamedTuple` pairs.
# 
# See example implementation in the [context file](https://github.com/JuliaPlots/AlgebraOfGraphics.jl/blob/master/src/context.jl).