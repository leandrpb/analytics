sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/build/standard/salesOrderAnalysis/model/models",
	"sap/ui/model/json/JSONModel",
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	var navigationWithContext = {
		"SalesOrderSet": {
			"Popover5": "SalesOrderItem",
			"Popover6": "Customer",
			"Popover4": ""
		},
		"SalesOrderItemSet": {
			"Popover5": "",
			"Popover6": "Customer",
			"Popover4": "SalesOrder"
		},
		"CustomerSet": {
			"Popover6": "",
			"Popover4": "SalesOrder"
		}
	};

	return UIComponent.extend("com.sap.build.standard.salesOrderAnalysis.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");

			// Cria Modo para labels
			let oJModel = new JSONModel();
			oJModel.setProperty("/historico", "Histórico Comprador: ");
			oJModel.setProperty("/material", "Materiais mais comprados: ")
			this.setModel(oJModel, "labels");

			// set the dataSource model
			this.setModel(new sap.ui.model.json.JSONModel({
				"uri": "/sap/opu/odata/sap/ZSI_SALES_ANAL_LPB_SRV/"
			}), "dataSource");

			// set application model
			var oApplicationModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oApplicationModel, "applicationModel");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		createContent: function() {
			var app = new sap.m.App({
				id: "App"
			});
			var appType = "App";
			var appBackgroundColor = "";
			if (appType === "App" && appBackgroundColor) {
				app.setBackgroundColor(appBackgroundColor);
			}

			return app;
		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}

	});

});
