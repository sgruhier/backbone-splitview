window.SplitView = Backbone.View.extend({
  el: $(document.body),
  
  // Delegated mouse down events
  events: {
    "mousedown .vsplit":  "mouseDownVSplit",
    "mousedown .hsplit":  "mouseDownHSplit"
  },
  
  initialize: function(element) {
    _.bindAll(this, 'endDrag', 'mouseMove', 'mouseDownVSplit', 'mouseDownHSplit');
  },
  
  prepareDrag: function(event) {
    $(document).bind("mousemove", this.mouseMove);
    $(document).bind("mouseup", this.endDrag);

    var element = $(event.target);
    _.extend(this.elementInfo, {element:    element, 
                                next:       element.next(), 
                                prev:       element.prev(), 
                                size:       element.prev()[this.elementInfo.attr](),
                                parentSize: this.computeChildrenSize(element.parent(), this.elementInfo.attr)});
    event.preventDefault();
  },
  
  endDrag: function(event) {
    $(document).unbind("mousemove", this.mouseMove)
    $(document).unbind("mouseup", this.endDrag)
  },
  
  mouseDownVSplit: function(event) {
    this.elementInfo = {attr: "width"}
    this.prepareDrag(event);

    this.mouseInfo   = {pos: event.pageX, attr: 'pageX'}
  },
  
  mouseDownHSplit: function(event) {
    this.elementInfo = {attr: "height"}
    this.prepareDrag(event);

    this.mouseInfo   = {pos: event.pageY, attr: 'pageY'}
  },
  
  mouseMove: function(event) {
    var info       = this.elementInfo,
        d          = event[this.mouseInfo.attr] - this.mouseInfo.pos,
        size       = info.size + d;
    info.prev[info.attr](size);
    
    var parentSize = this.computeChildrenSize(info.element.parent(), info.attr),
        delta      = info.parentSize - parentSize;
      
    if (delta != 0) {
      info.prev[info.attr](size + delta);
    }
    
    event.preventDefault();
  },
  
  computeChildrenSize: function(element, attr) {
    return _.inject(element.children(), function(memo, elt){ return memo + $(elt)[attr](); }, 0)
  }
}); 

