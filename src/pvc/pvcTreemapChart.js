
def
.type('pvc.TreemapChart', pvc.BaseChart)
.add({
    _animatable: false,

    _getColorRoleSpec: function() {
        return { 
            isRequired: true, 
            defaultSourceRole: 'category', 
            defaultDimension:  'color*'
            /*, requireIsDiscrete: true*/
        };
    },
    
    _initVisualRoles: function() {
        
        this.base();
        
        this._addVisualRole('category', { 
                isRequired: true, 
                defaultDimension: 'category*', 
                autoCreateDimension: true 
            });
            
        this._addVisualRole('size', {
                isMeasure:  true,
                isRequired: false,
                isPercent:  true,
                requireSingleDimension: true, 
                requireIsDiscrete: false,
                valueType: Number, 
                defaultDimension: 'size' 
            });
    },
    
    _getTranslationClass: function(translOptions) {
        return def.type(this.base(translOptions)).add(pvc.data.TreemapChartTranslationOper);
    },
    
    // Consider all datums to be not-null.
    // All measures are optional...
    // @override
    _getIsNullDatum: def.fun.constant(),
    
    _setAxesScales: function(hasMultiRole) {
        
        this.base(hasMultiRole);
        
        if(!hasMultiRole || this.parent) {
            var sizeAxis = this.axes.size;
            if(sizeAxis && sizeAxis.isBound()) {
                this._createAxisScale(sizeAxis);
                
                sizeAxis.setScaleRange({min: 100, max: 1000});
            }
        }
    },
    
    _initPlotsCore: function(/*hasMultiRole*/) {
        var treemapPlot = new pvc.visual.TreemapPlot(this);
        
        if(this.options.legend == null) {
            // Only show the legend by default if color mode is byparent
            this.options.legend = treemapPlot.option('ColorMode') === 'byparent';
        }
        
        var rootCategoryLabel = treemapPlot.option('RootCategoryLabel');
        this.visualRoles.category.setRootLabel(rootCategoryLabel);
        this.visualRoles.color   .setRootLabel(rootCategoryLabel);
    },
    
    _preRenderContent: function(contentOptions) {

        this.base();
        
        var treemapPlot = this.plots.treemap;
        new pvc.TreemapPanel(this, this.basePanel, treemapPlot, contentOptions);
    },
    
    _createVisibleData: function(dataPartValue, ka) {
        var visibleData = this.base(dataPartValue, ka);
        
        // There are no null datums in this chart type (see #_getIsNullDatum) 
        return visibleData ? this.visualRoles.category.select(visibleData, {visible: true}) : null;
    },
    
    defaults: {
        legend: null  // dynamic default, when nully
    }
});