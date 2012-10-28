Responsive tooltip for jquery. It uses two designs based on screen resolution (treshold is configurable).
On wide screens it's standard tooltip:

![Tooltip on desktop browser](http://mwozniak.pl/github/jquery-tooltip/tooltip-desktop.png)

On small screens (touch devices) it's popup with overlay:

![Tooltip on touch devices](http://mwozniak.pl/github/jquery-tooltip/tooltip-iphone.png)

#Arrow direction is configurable (there are 12 directions - check them out [here](http://mwozniak.pl/github/jquery-tooltip/examples/direction-examples.html)) and can look like this:
(You can play with directions with direction-examples.html inside examples directory or [here](http://mwozniak.pl/github/jquery-tooltip/examples/direction-examples.html)) 
![Directions](http://mwozniak.pl/github/jquery-tooltip/few-directions.jpg)


#Using on page:
##1. Add css and js file to you page:
####`<link type="text/css" rel="stylesheet" href="tooltip.css" />`
####`<script type="text/javascript" src="jquery-tooltip.js"></script>`
##2. Run tooltip inside your code:
####`$('selector-of-elements-with-tooltip').tooltip();`

# There are following configuration options:
###content (default: '') - html content that will be inserted into tooltip
###contentSelector (default: '') - selector of element that will be inserted into tooltip  (overrides 'content' option)
###event (default: 'click') - event that will trigger tooltip (click, hover, mouseover, focus)
###direction (default: 't') - direction where arrow will point to:
* 't' - top center
* 'tl' - top left
* 'tr' - top right
* 'r' - right center
* 'rt' - right top
* 'rb' - right bottom
* 'b' - bottom center
* 'bl' - bottom left
* 'br' - bottom right
* 'l' - left center
* 'lt' - left top
* 'lb' - left bottom

###leftOffset (default: 0) - additional offset used to shift tooltip to from left
###topOffset (default: 0) - additional offset used to shift tooltip to the bottom
###show (default: false) - show tooltip immediately after initialization

###All of options can be passed also as data-attribues of element that triggers tooltip:
`<button id="show-tooltip" data-direction="tr" data-content-selector=".tooltip-content">Show tooltip</button>`

#Global configuration options
##There are few options that can configure global behavior of tooltips on entire page:
###mobileTershold (default: 560) - screen width below which popup is used instead of tooltip
###onlyOneVisible (default: true) - show only one tooltip at the time (close all others when opening new one)

This configuration can be set as global variable:
`window.tooltipConfig = {
   mobileTreshold: 560,
   onlyOneVisible: true
}`

##All styles are defined in tooltip.styl - this is [stylus](http://learnboost.github.com/stylus/) file. Styles ready to production are inside tooltip.css.

The easiest way to modify styles is to modify tooltip.styl file and generate approipate css file with stylus.