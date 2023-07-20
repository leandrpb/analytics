sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(
	ManagedObject
) {
	"use strict";

	return ManagedObject.extend("com.sap.build.standard.salesOrderAnalysis.model.formatter", {
        parseFloatFormatter: function(sStringValue) {
            return parseFloat(sStringValue);
        }
	});
});