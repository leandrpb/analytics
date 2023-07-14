sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.salesOrderAnalysis.controller.Popover1", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.salesOrderAnalysis.view.Popover1", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		open: function() {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		onInit: function() {

			this._oDialog = this.getControl();

			this._oDialog.addEventDelegate({
				"onAfterRendering": this.onAfterRendering
			}, this);

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285"] = {};

			oData["sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285"]["data"] = [{
				"dim0": "January",
				"mea0": "1510000",
				"__id": 0
			}, {
				"dim0": "February",
				"mea0": "1305000",
				"__id": 1
			}, {
				"dim0": "March",
				"mea0": "1497000",
				"__id": 2
			}, {
				"dim0": "April",
				"mea0": "1297000",
				"__id": 3
			}, {
				"dim0": "May",
				"mea0": "1750000",
				"__id": 4
			}, {
				"dim0": "June",
				"mea0": "1496000",
				"__id": 5
			}, {
				"undefined": null,
				"dim0": "July",
				"mea0": "1460000",
				"__id": 6
			}, {
				"undefined": null,
				"dim0": "August",
				"mea0": "1480000",
				"__id": 7
			}, {
				"undefined": null,
				"dim0": "September",
				"mea0": "1520000",
				"__id": 8
			}, {
				"undefined": null,
				"dim0": "October",
				"mea0": "499000",
				"__id": 9
			}];

			self.oBindingParameters['sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285'] = {
				"path": "/sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285"]["vizProperties"] = {
				"dataLabel": {
					"visible": true,
					"hideWhenOverlap": true
				}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onExit: function() {
			this._oDialog.destroy();

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285");
			oChart.bindData(oBindingParameters['sap_m_ResponsivePopover_0-content-sap_chart_LineChart-1539254050285']);

		}

	});
}, /* bExport= */ true);
