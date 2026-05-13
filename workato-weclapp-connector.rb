{
  title: "weclapp",

  connection: {

    fields: [
      {
        name: "api_token",
        control_type: "password",
        label: "API token",
        optional: false,
        hint: "Setup your token in the 'My settings > API' page"
      },
      {
        name: "subdomain",
        control_type: "subdomain",
        url: ".weclapp.com",
        label: "weclapp domain",
        optional: false,
        hint: "Please provide your weclapp instance specific sub-domain."
      },
    ],

    authorization: {
      type: 'custom_auth',

      apply: lambda do |connection|
        headers("AuthenticationToken": "#{connection["api_token"]}")
      end
    },

    base_uri: lambda do |connection|
      "https://#{connection['subdomain']}.weclapp.com/webapp/api/v1/"
    end
  },

  test: lambda do |connection|
    get('user/count')
  end,

  object_definitions: {
    address: {
      fields: lambda do |_connection, _config_fields|
        [
          { name: "id" },
          { name: "company" },
          { name: "company2" },
          { name: "title" },
          { name: "titleId" },
          { name: "firstName" },
          { name: "lastName" },
          { name: "street1" },
          { name: "street2" },
          { name: "zipcode" },
          { name: "city" },
          { name: "state" },
          { name: "countryCode" },
          { name: "salutation" },
          { name: "phoneNumber" },
          { name: "globalLocationNumber" },
          { name: "postOfficeBoxCity" },
          { name: "postOfficeBoxNumber" },
          { name: "postOfficeBoxZipCode" },
          { name: "deliveryAddress", type: "boolean" },
          { name: "invoiceAddress", type: "boolean" },
          { name: "primeAddress", type: "boolean" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    commissionSalesPartners: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" }, 
          { name: "commissionFix" }, 
          { name: "commissionPercentage" }, 
          { name: "commissionType", hint: "Must be one of: FIX, FIX_AND_MARGIN, FIX_AND_REVENUE, MARGIN, NO_COMMISSION, REVENUE" }, 
          { name: "salesPartnerSupplierId" }, 
          { name: "salesPartnerSupplierNumber" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    party: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'party')
        [
          { name: "id" },
          { name: "company" },
          { name: "customer", type: "boolean", control_type: "checkbox",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "customer",
              label: "Customer",
              type: "boolean",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be 'true' or 'false'"
            }
          },
          { name: "company2" },
          { name: "customerNumber" },
          { name: "customerNumberOld" },
          { name: "customerSalesChannel", control_type: "select", pick_list: "sales_channels" },
          { name: "partyType", hint: "Allowed values: ORGANIZATION, PERSON" },
          { name: "personCompany" },
          { name: "personDepartmentId", control_type: "select",
            pick_list: "personDepartments",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "personDepartmentId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid department ID. For instance: '4969'"
            }
          },
          { name: "personRoleId", control_type: "select",
            pick_list: "personRoles",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "personRoleId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid role ID. For instance: '4969'"
            }
          },
          { name: "salutation", hint: "Must be one of: MR, MRS, FAMILY, COMPANY, NO_SALUTATION" },
          { name: "title" },
          { name: "titleId" },
          { name: "firstName" },
          { name: "middleName" },
          { name: "lastName" },
          { name: "mobilePhone1" },
          { name: "phone" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "responsibleUserId" },
          { name: "responsibleUserUsername" },
          { name: "website" },
          { name: "email" },
          { name: "fax" },
          { name: "birthDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "primaryAddressId" },
          { name: "deliveryAddressId" },
          { name: "invoiceAddressId" },
          { name: "addresses", type: "array", of: "object", properties: object_definitions['address'] },
          { name: "bankAccounts", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "accountHolder" },
            { name: "accountNumber" },
            { name: "bankCode" },
            { name: "creditInstitute" },
            { name: "partyId" },
            { name: "primary", type: "boolean" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "onlineAccounts", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "accountName" },
            { name: "accountType" },
            { name: "url" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "commercialLanguageId", control_type: "select", 
            pick_list: "commercialLanguages",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "commercialLanguageId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid language. For instance: 'de'"
            }
          },
          { name: "commissionSalesPartners", type: "array", of: "object", properties: object_definitions['commissionSalesPartners'] },
          { name: "companySizeId" },
          { name: "companySizeName" },
          { name: "competitor", type: "boolean" },
          { name: "contacts", type: "array", of: "object", properties: [
            { name: "id" }
          ]},
          { 
            name: "allowPurchaseOrderCreation", type: "boolean", control_type: "checkbox"
          },
          { name: "currencyId" },
          { name: "currencyName" },
          { name: "customerAmountInsured" },
          { name: "customerAnnualRevenue" },
          { name: "customerBlockNotice" },
          { name: "customerBlocked", type: "boolean", control_type: "checkbox" },
          { name: "customerBusinessType", hint: "Must be one of: B2B, B2C, B2G" },
          { name: "customerCategoryId", control_type: "select", 
            pick_list: "customerCategories",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "customerCategoryId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid customer category ID. For instance: '3674'"
            }
          },
          { name: "customerCategoryName" },
          { name: "customerCreditLimit" },
          { name: "customerCurrentSalesStageId" },
          { name: "customerCurrentSalesStageName" },
          { name: "customerDebtorAccountId" },
          { name: "customerDebtorAccountNumber" },
          { name: "customerDebtorAccountingCodeId" },
          { name: "customerDefaultHeaderDiscount" },
          { name: "customerDefaultHeaderSurcharge" },
          { name: "customerDefaultShippingCarrierId" },
          { name: "customerDeliveryBlock", type: "boolean", control_type: "checkbox" },
          { name: "customerInsolvent", type: "boolean", control_type: "checkbox" },
          { name: "customerInsured", type: "boolean", control_type: "checkbox" },
          { name: "customerInternalNote" },
          { name: "customerLossDescription", hint: "Max 255 chars" },
          { name: "customerLossReasonId" },
          { name: "customerLossReasonName" },
          { name: "customerNonStandardTaxId" },

          { name: "customerPaymentMethodId" },
          { name: "customerPaymentMethodName" },
          { name: "customerSalesOrderPaymentType" },
          { name: "customerSalesProbability", type: "number" },
          { name: "customerSalesStageHistory", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "salesStageId" },
            { name: "salesStageName" },
            { name: "userId" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "customerSatisfaction" },
          { name: "customerShipmentMethodName" },
          { name: "customerShipmentMethodId" },
          { name: "customerSupplierNumber" },
          { name: "customerTermOfPaymentId" },
          { name: "customerTermOfPaymentName" },
          { name: "customerUseCustomsTariffNumber", type: "boolean", control_type: "checkbox" },
          { name: "deliveryEmailAddressesId" },
          { name: "description" },
          { name: "dunningAddressId" },
          { name: "dunningEmailAddressesId" },
          { name: "enableDropshippingInNewSupplySources", type: "boolean" },
          { name: "eoriNumber" },
          { name: "factoring", type: "boolean", control_type: "checkbox" },
          { name: "fixPhone2" },
          { name: "fixedResponsibleUser", type: "boolean", control_type: "checkbox" },
          { name: "formerSalesPartner", type: "boolean", control_type: "checkbox" },
          { name: "habitualExporter", type: "boolean", control_type: "checkbox" },
          { name: "imageId" },
          { name: "invoiceBlock", type: "boolean", control_type: "checkbox" },
          { name: "invoiceRecipientId" },
          { name: "leadRatingId", control_type: "select", pick_list: "leadRatings",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "leadRatingId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid lead rating ID. For instance: '4969'"
            }
          },
          { name: "leadRatingName" },
          { name: "leadSourceId", control_type: "select", pick_list: "leadSources",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "leadSourceId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid lead source ID. For instance: '4969'"
            }
          },
          { name: "leadSourceName" },
          { name: "leadStatus", hint: "Must be one of: CONVERTED, DISQUALIFIED, NEW, PREQUALIFIED, QUALIFIED" },
          { name: "legalFormId" },
          { name: "legalFormName" },
          { name: "mobilePhone2" },
          { name: "optInEmail", type: "boolean", control_type: "checkbox" },
          { name: "optInLetter", type: "boolean", control_type: "checkbox" },
          { name: "optInPhone", type: "boolean", control_type: "checkbox" },
          { name: "optInSms", type: "boolean", control_type: "checkbox" },
          { name: "parentPartyId" },
          { name: "partyEmailAddresses", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "automaticallySuggestInInvoice", type: "boolean" },
            { name: "date", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "fromSupplier", type: "boolean" },
            { name: "invoices", type: "array", of: "object", properties: [
              { name: "id" }
            ]},
            { name: "numberDeclarer" },
            { name: "numberSupplier" },
            { name: "totalAmount" },
            { name: "type" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "phoneHome"},
          { name: "primaryContactId"},
          { name: "purchaseEmailAddressesId"},
          { name: "purchaseViaPlafond", type: "boolean", control_type: "checkbox" },
          { name: "ratingId", control_type: "select", pick_list: "partyRatings",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "ratingId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid rating ID. For instance: '3864'"
            }
          },
          { name: "ratingName" },
          { name: "referenceNumber"},
          { name: "salesInvoiceEmailAddressesId"},
          { name: "salesOrderEmailAddressesId"},
          { name: "salesPartner", type: "boolean", control_type: "checkbox" },
          { name: "salesPartnerDefaultCommissionFix"},
          { name: "salesPartnerDefaultCommissionPercentage"},
          { name: "salesPartnerDefaultCommissionType", 
            hint: "Must be one of: FIX, FIX_AND_MARGIN, FIX_AND_REVENUE, MARGIN, NO_COMMISSION, REVENUE" },
          { name: "sectorId", control_type: "select", pick_list: "sectors",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "sectorId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid sector ID. For instance: '3864'"
            }
          },
          { name: "sectorName"},
          { name: "supplier", type: "boolean", control_type: "checkbox" },

          { name: "supplierCreditorAccountId"},
          { name: "supplierCreditorAccountNumber"},
          { name: "supplierCreditorAccountingCodeId"},
          { name: "supplierCustomerNumberAtSupplier", hint: "Max 64 chars"},
          { name: "supplierDefaultShippingCarrierId"},
          { name: "supplierInternalNote"},
          { name: "supplierMinimumPurchaseOrderAmount"},

          { name: "supplierNonStandardTaxId"},
          { name: "supplierNumber"},
          { name: "supplierNumberOld"},
          { name: "supplierOrderBlock", type: "boolean", control_type: "checkbox" },
          { name: "supplierPaymentMethodId"},
          { name: "supplierPaymentMethodName"},

          { name: "supplierShipmentMethodId"},
          { name: "supplierShipmentMethodName"},
          { name: "supplierTermOfPaymentId"},
          { name: "supplierTermOfPaymentName"},
          { name: "taxId"},
          { name: "topics", type: "array", of: "object", properties: [
            { name: "id", control_type: "select", pick_list: "customerTopics", 
              toggle_hint: "Select from list",
              toggle_field: {
                name: "id",
                type: "string",
                control_type: "text",
                toggle_hint: "Use value",
                hint: "Must be a valid customer topic ID. For instance: '3674'"
              }
            }
          ]},
          { name: "vatIdentificationNumber"},
          { name: "xRechnungLeitwegId", hint: "Max 46 chars"},
          { name: "tags", type: "array", of: "string" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    emails: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "toAddresses" },
          { name: "ccAddresses" },
          { name: "bccAddresses" }
        ]
      end
    },
    shippingCostItems: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" },
          { name: "articleId" },
          { name: "articleNumber" },
          { name: "grossAmount" },
          { name: "grossAmountInCompanyCurrency" },
          { name: "manualUnitPrice", type: "boolean" },
          { name: "netAmount" },
          { name: "netAmountInCompanyCurrency" },
          { name: "unitPrice" },
          { name: "unitPriceInCompanyCurrency" },
          { name: "manualUnitCost", type: "boolean" },
          { name: "taxId", control_type: "select", pick_list: "taxes",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "taxId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid tax ID. For instance: '3721'"
            }
          },
          { name: "taxName" },
          { name: "unitCost" },
          { name: "unitCostInCompanyCurrency" },
          { name: "createdDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "lastModifiedDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "version" }
        ]
      end
    },
    article: {
      fields: lambda do |_connection, _config_fields|
        custom_props = call('create_custom_properties_schema', 'article')
        fields = [
          { name: "id" },
          { name: "articleNumber" },
          { name: "description" },
          { name: "ean" },
          { name: "fixedPurchaseQuantity" },
          { name: "internalNote" },
          { name: "manufacturerPartNumber" },
          { name: "matchCode" },
          { name: "minimumPurchaseQuantity" },
          { name: "name" },
          { name: "shortDescription1" },
          { name: "shortDescription2" },
          { name: "taxRateType" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "unitId" },
          { name: "unitName" },
          { name: "accountId" },
          { name: "accountNumber" },
          { name: "accountingCodeId" },
          { name: "active", type: "boolean" },
          { name: "applyCashDiscount", type: "boolean" },
          { name: "articleAlternativeQuantities", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "minimumOrderQuantity" },
            { name: "minimumStockQuantity" },
            { name: "targetStockQuantity" },
            { name: "warehouseId" },
            { name: "warehouseName" },
            { name: "createdDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "version" }
          ]
          },
          { name: "articleCalculationPrices", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "articleCalculationPriceType" },
            { name: "positionNumber" },
            { name: "price" },
            { name: "salesChannel", control_type: "select", pick_list: "sales_channels",
              toggle_hint: "Select from list",
              toggle_field: {
                name: "salesChannel",
                type: "string",
                control_type: "text",
                toggle_hint: "Use value",
                hint: "Must be a valid sales channel ID. For instance: 'NET1'"
              }
            },
            { name: "startDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "endDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "createdDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "version" },
          ]},
          { 
            name: "articleCategoryId", control_type: "select",
            pick_list: "article_categories", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "articleCategoryId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid category id. For instance: 4830"
            }
          },
          { name: "articleGrossWeight" },
          { name: "articleHeight" },
          { name: "articleImages", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "fileName" },
            { name: "mainImage", type: "boolean" },
            { name: "createdDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "version" }
          ]},
          { name: "articleLength" },
          { name: "articleNetWeight" },
          { name: "articlePrices", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "currencyId" },
            { name: "currencyName" },
            { name: "customerId" },
            { name: "description" },

            { name: "endDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "startDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedByUserId" },
            { name: "positionNumber", type: "number", parse_output: "float_conversion" },
            { name: "price" },
            { name: "priceScaleType" },
            { name: "priceScaleValue" },
            { name: "reductionAdditions", type: "array", of: "object", properties: [
              { name: "id" },
              { name: "name" },
              { name: "type" },
              { name: "value" },
              { name: "createdDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "lastModifiedDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "version" },
            ]},
            { name: "salesChannel", control_type: "select", pick_list: "sales_channels",
              toggle_hint: "Select from list",
              toggle_field: {
                name: "salesChannel",
                type: "string",
                control_type: "text",
                toggle_hint: "Use value",
                hint: "Must be a valid sales channel ID. For instance: 'NET1'"
              }
            },
          ]
          },
          { name: "articleType" },
          { name: "articleWidth" },
          { name: "availableForSalesChannels", type: "array", of: "string" },
          { name: "availableInSale", type: "boolean" },
          { name: "averageDeliveryTime", type: "number", control_type: "number", parse_output: "float_conversion" },
          { name: "barcode" },
          { name: "batchNumberRequired", type: "boolean" },
          { name: "billOfMaterialPartDeliveryPossible", type: "boolean" },
          { name: "catalogCode" },
          { name: "commissionRate" },
          { name: "contractBillingCycle" },
          { name: "contractBillingMode" },
          { name: "countryOfOriginCode" },
          { name: "customerArticleNumbers", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "customerArticleNumber" },
            { name: "customerId" },
            { name: "createdDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "version" }
          ]},
          { name: "customsDescription" },
          { name: "customsTariffNumber" },
          { name: "customsTariffNumberId", control_type: "select",
            pick_list: "customs_tariff_numbers", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "customsTariffNumberId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid customs tariff number id. For instance: 4830"
            }
          },
          { name: "defaultLoadingEquipmentIdentifierId", 
            hint: "Must be a valid customs tariff number id. For instance: 4830" },
          { name: "defaultPriceCalculationType" },
          { name: "defaultStoragePlaces", type: "array", of: "object", properties: [
            { name: "id" }
          ]},
          { name: "defineIndividualTaskTemplates", type: "boolean" },
          { name: "expenseAccountId" },
          { name: "expenseAccountNumber" },
          { name: "expirationDays", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "invoicingType" },
          { name: "launchDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "loadingEquipmentArticleId" },
          { name: "longText" },
          { name: "lowLevelCode", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "manufacturerId", control_type: "select",
            pick_list: "manufacturers", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "manufacturerId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid manufacturer id. For instance: 4830"
            }
          },
          { name: "manufacturerName" },
          { name: "marginCalculationPriceType" },
          { name: "minimumStockQuantity" },
          { name: "packagingQuantity", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "packagingUnitBaseArticleId" },
          { name: "packagingUnitParentArticleId" },
          { name: "plannedWorkingTimePerUnit", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "priceCalculationParameters", type: "array", of: "object", properties: [
            { name: "id" },            
            { name: "fixSurcharge" },
            { name: "fromScale" },
            { name: "lowerPurchasePriceBound" },
            { name: "margin" },
            { name: "percentSurcharge" },
            { name: "profit" },
            { name: "salesChannel", control_type: "select", pick_list: "sales_channels",
              toggle_hint: "Select from list",
              toggle_field: {
                name: "salesChannel",
                type: "string",
                control_type: "text",
                toggle_hint: "Use value",
                hint: "Must be a valid sales channel ID. For instance: 'NET1'"
              }
            },
            { name: "createdDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "version" }
          ]},
          { name: "primarySupplySourceId" },
          { name: "procurementLeadDays", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "producerType" },
          { name: "productionArticle", type: "boolean" },
          { name: "productionBillOfMaterialItems", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "articleId" },
            { name: "articleNumber" },
            { name: "positionNumber", type: "number", parse_output: "float_conversion", control_type: "number" },
            { name: "quantity" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" },
          ]},
          { name: "productionConfigurationRule" },
          { name: "purchaseCostCenterId" },
          { name: "purchaseCostCenterNumber" },
          { name: "quantityConversions", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "conversionQuantity" },
            { name: "createdUserId" },
            { name: "lastEditedUserId" },
            { name: "oppositeDirection", type: "boolean" },
            { name: "unitId" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "ratingId" },
          { name: "ratingName" },
          { name: "recordItemGroupName" },
          { name: "safetyStockDays", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "salesBillOfMaterialItems", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "articleId" },
            { name: "articleNumber" },
            { name: "positionNumber", type: "number", parse_output: "float_conversion", control_type: "number" },
            { name: "quantity" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "salesCostCenterId" },
          { name: "salesCostCenterNumber" },
          { name: "sellByDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "sellFromDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "serialNumberRequired", type: "boolean" },
          { name: "showOnDeliveryNote", type: "boolean" },
          { name: "statusId" },
          { name: "supplySources", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "articleSupplySourceId" },
            { name: "positionNumber", type: "number", parse_output: "float_conversion", control_type: "number" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "supportUntilDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "systemCode" },
          { name: "tags", type: "array", of: "string" },
          { name: "targetStockQuantity" },
          { name: "useAvailableForSalesChannels", type: "boolean" },
          { name: "useSalesBillOfMaterialItemPrices", type: "boolean" },
          { name: "useSalesBillOfMaterialItemPricesForPurchase", type: "boolean" },
          { name: "createdDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "lastModifiedDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "version" }
        ]
        if _config_fields['extraInfo'] == "true"
          fields.concat( 
            [
              { name: "extraInfo", type: "object", properties: 
                [
                  { name: "confirmedOrderedQuantity" },
                  { name: "currentYearRevenue" },
                  { name: "currentYearSalesOrderVolume" },
                  { name: "lastYearRevenue" },
                  { name: "lastYearSalesOrderVolume" },
                  { name: "orderedQuantity" },
                  { name: "stockQuantity" },
                  { name: "stockQuantityWithoutOrder" }
                ]
              }
            ]
          )
        end
        fields
      end
    },
    salesOrder: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'salesOrder')
        custom_props_items = call('create_custom_properties_schema', 'salesOrderItem')
        [
          { name: "id" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage", hint: "Must be a valid language. For instance: 'de'" },
          { name: "creatorId" },
          { name: "description" },
          { name: "disableEmailTemplate", type: "boolean" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient", type: "boolean" },
          { name: "tags", type: "array", of: "string" },
          { name: "currencyConversionDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "currencyConversionRate" },
          { name: "grossAmount" },
          { name: "grossAmountInCompanyCurrency" },
          { name: "headerDiscount" },
          { name: "headerSurcharge" },
          { name: "netAmount" },
          { name: "netAmountInCompanyCurrency" },
          { name: "nonStandardTaxId", control_type: "select", pick_list: "taxes", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "nonStandardTaxId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid tax ID. For instance: '3721'"
            }
          },
          { name: "nonStandardTaxName" },
          { name: "paymentMethodId", control_type: "select",
            pick_list: "paymentMethods", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "paymentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid payment method ID. For instance: '3721'"
            }
          },
          { name: "paymentMethodName" },
          { name: "recordCurrencyName", control_type: "select",
            pick_list: "currencies", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "recordCurrencyName",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid currency. For instance: 'EUR'"
            }
          },
          { name: "recordCurrencyId"},
          { name: "termOfPaymentId", control_type: "select",
            pick_list: "termOfPayments", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "termOfPaymentId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid term of payment ID. For instance: '3690'"
            }
          },
          { name: "termOfPaymentName" },
          { name: "commission" },
          { name: "commissionSalesPartners", type: "array", of: "object", properties: object_definitions['commissionSalesPartners']},
          { name: "customerId" },
          { name: "customerNumber" },
          { name: "dispatchCountryCode" },
          { name: "factoring", type: "boolean" },
          { name: "pricingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "responsibleUserId" },
          { name: "responsibleUserUsername" },
          { name: "salesChannel", control_type: "select", pick_list: "sales_channels",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "salesChannel",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid sales channel ID. For instance: 'NET1'"
            }
          },
          { name: "servicePeriodFrom", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "servicePeriodTo", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "shipmentMethodId", control_type: "select", pick_list: "shipmentMethods",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "shipmentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid shipment method ID. For instance: '3721'"
            }
          },
          { name: "shipmentMethodName" },
          { name: "shippingCostItems", type: "array", of: "object", properties: object_definitions['shippingCostItems'] },
          { name: "defaultShippingCarrierId", control_type: "select", 
            pick_list: "shippingCarriers",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "defaultShippingCarrierId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid shipping carrier ID. For instance: '3721'"
            }
          },
          { name: "defaultShippingCarrierName" },
          { name: "deliveryAddress", type: "object", properties: object_definitions['address'] },
          { name: "deliveryEmailAddresses", type: "object", properties: [
            { name: "bccAddresses" },
            { name: "ccAddresses" },
            { name: "toAddresses" }
          ]},
          { name: "invoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "plannedDeliveryDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "plannedShippingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "recordAddress", type: "object", properties: object_definitions['address'] },
          { name: "salesInvoiceEmailAddresses", type: "object", properties: [
            { name: "bccAddresses" },
            { name: "ccAddresses" },
            { name: "toAddresses" }
          ]},
          { name: "advancePaymentAmount" },
          { name: "advancePaymentStatus" },
          { name: "availability" },
          { name: "availabilityForAllWarehouses" },
          { name: "cashAccountId" },
          { name: "customerHabitualExporterLetterOfIntentId" },
          { name: "defaultShippingReturnCarrierId" },
          { name: "defaultShippingReturnCarrierName" },
          { name: "ecommerceOrder", type: "object", properties: [
            { name: "ecommerceId" },
            { name: "externalConnectionId" }
          ]},
          { name: "fulfillmentProviderId", control_type: "select", 
            pick_list: "fulfillmentProviders",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "fulfillmentProviderId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid fulfillment provider ID. For instance: '3721'"
            }
          },
          { name: "invoiceRecipientId" },
          { name: "invoiced", type: "boolean" },
          { name: "onlyServices", type: "boolean" },
          { name: "orderDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "orderItems", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "articleId" },
            { name: "articleNumber" },
            { name: "note" },
            { name: "positionNumber", type: "number", parse_output: "float_conversion", control_type: "number" },
            { name: "quantity" },
            { name: "description" },
            { name: "descriptionFixed", type: "boolean" },
            { name: "manualQuantity", type: "boolean" },
            { name: "parentItemId" },
            { name: "title" },
            { name: "unitId" },
            { name: "unitName" },
            { name: "discountPercentage" },
            { name: "grossAmount" },
            { name: "grossAmountInCompanyCurrency" },
            { name: "manualUnitPrice", type: "boolean" },
            { name: "netAmount" },
            { name: "netAmountForStatistics" },
            { name: "netAmountForStatisticsInCompanyCurrency" },
            { name: "netAmountInCompanyCurrency" },
            { name: "reductionAdditionItems", type: "array", of: "object", properties: [
              { name: "position", type: "number", parse_output: "float_conversion", control_type: "number" },
              { name: "source" },
              { name: "type" },
              { name: "value" }
            ]},
            { name: "taxId" },
            { name: "taxName" },
            { name: "unitPrice" },
            { name: "unitPriceInCompanyCurrency" },
            { name: "addPageBreakBefore", type: "boolean" },
            { name: "customAttributes", type: "object", properties: custom_props_items },
            { name: "freeTextItem", type: "boolean" },
            { name: "groupName" },
            { name: "commissionSalesPartners", type: "array", of: "object", properties: object_definitions['commissionSalesPartners']},
            { name: "manualUnitCost", type: "boolean" },
            { name: "servicePeriodFrom", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "servicePeriodTo", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "unitCost" },
            { name: "unitCostInCompanyCurrency" },
            { name: "invoicingType" },
            { name: "itemType" },
            { name: "manualPlannedWorkingTimePerUnit", type: "boolean" },
            { name: "plannedWorkingTimePerUnit", type: "number", parse_output: "float_conversion", control_type: "number" },
            { name: "availability" },
            { name: "availabilityForAllWarehouses" },
            { name: "ecommerceOrderItemIds", type: "array", of: "string" },
            { name: "invoicedQuantity" },
            { name: "pickBatchNumber" },
            { name: "pickSerialNumbers", type: "array", of: "string" },
            { name: "pickStoragePlaceId" },
            { name: "plannedShippingDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "returnedQuantity" },
            { name: "shipped", type: "boolean" },
            { name: "shippedQuantity" },
            { name: "tasks", type: "array", of: "object", properties: [
              { name: "id" }
            ]},
            { name: "createdDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "lastModifiedDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "version" }
          ]
          },
          { name: "orderNumber" },
          { name: "orderNumberAtCustomer" },
          { name: "paid", type: "boolean" },
          { name: "payments", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "amount" },
            { name: "positionNumber", type: "number", parse_output: "float_conversion", control_type: "number" },
            { name: "salesInvoiceId" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" }
          ]},
          { name: "plannedProjectEndDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "plannedProjectStartDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "projectGoals" },
          { name: "projectMembers", type: "array", of: "object", properties: [
            { name: "id" },
            { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "version" },
            { name: "hourlyCost" },
            { name: "teamRole" },
            { name: "userId" }
          ]},
          { name: "projectModeActive", type: "boolean" },
          { name: "quotationId" },
          { name: "quotationNumber" },
          { name: "recordEmailAddresses", type: "object", properties: [
            { name: "bccAddresses" },
            { name: "ccAddresses" },
            { name: "toAddresses" }
          ]},
          { name: "salesOrderPaymentType" },
          { name: "servicesFinished", type: "boolean" },
          { name: "shipped", type: "boolean" },
          { name: "shippingLabelsCount", type: "number", parse_output: "float_conversion", control_type: "number" },
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: [
            { name: "status" },
            { name: "statusDate", type: "date_time", convert_output: "epoch_time_conversion" },
            { name: "userId" }
          ]},
          { name: "template", type: "boolean" },
          { name: "warehouseId" },
          { name: "warehouseName" },
          { name: "createdDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "lastModifiedDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "version" },
        ]
      end
    },
    purchaseOrder: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'purchaseOrder')
        custom_props_items = call('create_custom_properties_schema', 'purchaseOrderItems')
        [
          { name: "id" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage", hint: "Must be a valid language. For instance: 'de'" },
          { name: "creatorId" },
          { name: "description" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient", type: "boolean", control_type: "checkbox" },
          { name: "tags", type: "array", of: "string" },
          { name: "currencyConversionDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "grossAmount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "headerDiscount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "headerSurcharge", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "netAmount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "netAmountInCompanyCurrency", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "nonStandardTaxId" },
          { name: "paymentMethodId", control_type: "select",
            pick_list: "paymentMethods", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "paymentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid payment method ID. For instance: '3721'"
            }
          },
          { name: "paymentMethodName" },
          { name: "recordCurrencyId", control_type: "select",
            pick_list: "currencies", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "recordCurrencyName",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid currency. For instance: 'EUR'"
            }
          },
          { name: "termOfPaymentId", control_type: "select",
            pick_list: "termOfPayments", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "termOfPaymentId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid term of payment ID. For instance: '3690'"
            }
          },
          { name: "termOfPaymentName" },
          { name: "recordEmailAddresses", type: "object", properties: 
            [
              { name: "bccAddresses" },
              { name: "ccAddresses" },
              { name: "toAddresses" }
            ]
          },
          { name: "responsibleUserId" },
          { name: "servicePeriodFrom", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "servicePeriodTo", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "supplierId" },
          { name: "advancePaymentStatus" },
          { name: "commercialLanguageCustomer" },
          { name: "commission" },
          { name: "confirmationNumber" },
          { name: "deliveryAddress", type: "object", properties: object_definitions['address'] },
          { name: "dropshippingDeliveryNoteFormTexts", type: "object", properties: 
            [
              { name: "recordComment" },
              { name: "recordFreeText" },
              { name: "recordOpening" }
            ]
          },
          { name: "externalPurchaseOrderNumber" },
          { name: "formSettingsFromSalesChannel", control_type: "select", pick_list: "sales_channels",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "salesChannel",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid sales channel ID. For instance: 'NET1'"
            }
          },
          { name: "invoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "invoiced", type: "boolean", control_type: "checkbox" },
          { name: "mergedToPurchaseOrderId" },
          { name: "note" },
          { name: "orderDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "packageTrackingNumber" },
          { name: "packageTrackingUrl" },
          { name: "paid", type: "boolean", control_type: "checkbox" },
          { name: "plannedDeliveryDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "plannedShippingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "purchaseOrderItems", type: "array", of: "object", properties: 
            [
              { name: "customAttributes", type: "object", properties: custom_props_items },
              { name: "articleId" },
              { name: "note" },
              { name: "positionNumber", type: "integer", control_type: "integer",
                parse_output: "integer_conversion", parse_input: "integer_conversion",
              },
              { name: "quantity", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "description" },
              { name: "descriptionFixed", type: "boolean", control_type: "checkbox" },
              { name: "itemType" },
              { name: "manualQuantity", type: "boolean", control_type: "checkbox" },
              { name: "parentItemId" },
              { name: "title" },
              { name: "unitId" },
              { name: "discountPercentage", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "manualUnitPrice", type: "boolean", control_type: "checkbox" },
              { name: "netAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountForStatistics", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountForStatisticsInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "reductionAdditionItems", type: "array", of: "object", properties: 
                [
                  { name: "position", control_type: "integer", type: "integer", 
                    parse_output: "integer_conversion", parse_input: "integer_conversion",
                  },
                  { name: "source" },
                  { name: "specialPriceReduction", type: "boolean", control_type: "checkbox" },
                  { name: "title" },
                  { name: "type" },
                  { name: "value", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  }
                ]
              },
              { name: "taxId" },
              { name: "unitPrice", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPriceInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "addPageBreakBefore", type: "boolean", control_type: "checkbox" },
              { name: "groupName" },
              { name: "articleSupplySourceId" },
              {
                name: "batchSerialNumbers", type: "array", of: "object",  properties: 
                [
                  { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "version" },
                  { name: "batchNumber" },
                  { name: "expirationDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "quantity", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion"
                  },
                  { name: "serialNumbers", type: "array", of: "string" },
                ]
              },
              { name: "blanketPurchaseOrderId" },
              { name: "blanketPurchaseOrderReleaseId" },
              { name: "invoicedQuantity", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion"
              },
              { name: "plannedDeliveryDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "plannedShippingDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "purchaseOrderRequestOfferItemId" },
              { name: "receivedQuantity", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion"
              },
              { name: "salesOrderItemId" },
              { name: "servicePeriodFromDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "servicePeriodToDate", type: "date_time", convert_output: "epoch_time_conversion" },
            ]
          },
          { name: "purchaseOrderNumber" },
          { name: "purchaseOrderRequestId" },
          { name: "purchaseOrderType" },
          { name: "received", type: "boolean", control_type: "checkbox" },
          { name: "recipientCountryCode" },
          { name: "recordAddress", type: "array", of: "object", properties: object_definitions['address'] },
          { name: "salesOrderId" },
          { name: "senderCountryCode" },
          { name: "shipmentMethodId" },
          { name: "shippingCarrierId" },
          { name: "shippingCostItems", type: "array", of: "object", properties: object_definitions['shippingCostItems'] },
          { name: "shippingNotificationDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: 
            [
              { name: "status" },
              { name: "statusDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "userId" }
            ]
          },
          { name: "supplierHabitualExporterLetterOfIntentId" },
          { name: "supplierQuotationNumber" },
          { name: "warehouseId" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    incomingGoods: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'incomingGoods')
        custom_props_items = call('create_custom_properties_schema', 'incomingGoodsItems')
        [
          { name: "id" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage", hint: "Must be a valid language. For instance: 'de'" },
          { name: "creatorId" },
          { name: "description" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient", type: "boolean", control_type: "checkbox" },
          { name: "tags", type: "array", of: "string" },
          { name: "invoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "recipientAddress", type: "object", properties: object_definitions['address'] },
          { name: "salesOrders", type: "array", of: "object", properties: [
            { name: "id" }
          ]},
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: [
            { name: "status" },
            { name: "statusDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "userId" }
          ]},
          { name: "customerDeliveryAddress", type: "object", properties: object_definitions['address'] },
          { name: "customerInvoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "deliveryNoteNumber" },
          { name: "dhlReceiverId" },
          { name: "dropshippingShipmentId" },
          { name: "incomingGoodsItems", type: "array", of: "object", properties: 
            [
              { name: "customAttributes", type: "object", properties: custom_props_items },
              { name: "articleId" },
              { name: "note" },
              { name: "positionNumber", type: "integer", control_type: "integer",
                parse_output: "integer_conversion", parse_input: "integer_conversion",
              },
              { name: "quantity", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "description" },
              { name: "descriptionFixed", type: "boolean", control_type: "checkbox" },
              { name: "itemType" },
              { name: "manualQuantity", type: "boolean", control_type: "checkbox" },
              { name: "parentItemId" },
              { name: "title" },
              { name: "unitId" },
              { name: "dropshippingShipmentItemId" },
              { name: "itemGroup" },
              { name: "purchaseOrderItemId" },
              { name: "returnAssessments", type: "array", of: "object", properties: [
                { name: "id" }
              ]
              },
              { name: "returnDescription" },
              { name: "returnErrors", type: "array", of: "object", properties: [
                { name: "id" }
              ]
              },
              { name: "returnReasons", type: "array", of: "object", properties: [
                { name: "id" }
              ]
              },
              { name: "returnRectifications", type: "array", of: "object", properties: [
                { name: "id" }
              ]
              },
              { name: "salesOrderItemId" },
            ]
          },
          { name: "incomingGoodsNumber" },
          { name: "incomingGoodsType" },
          { name: "invoiceRecipientId" },
          { name: "purchaseOrders", type: "array", of: "object", properties: [
            { name: "id" }
          ]
          },
          { name: "relatedShipmentId" },
          { name: "responsibleUserId" },
          { name: "returnAddress", type: "object", properties: object_definitions['address'] },
          { name: "senderCustomerNumber" },
          { name: "senderPartyId" },
          { name: "senderSupplierNumber" },
          { name: "shippingReturnCarrierId" },
          { name: "sourceWarehouseId" },
          { name: "warehouseId" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    shipment: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'shipment')
        [
          { name: "id" },
          { name: "createdDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "lastModifiedDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "version" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage", control_type: "select", 
            pick_list: "commercialLanguages",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "commercialLanguage",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid language. For instance: 'de'"
            }
          },
          { name: "creatorId" },
          { name: "description" },
          { name: "disableEmailTemplate" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient" },
          { name: "tags", type: "array", of: "string" },
          { name: "invoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "recipientAddress", type: "object", properties: object_definitions['address'] },
          { name: "salesOrderId" },
          { name: "salesOrderNumber" },
          { name: "salesOrders", type: "array", of: "object", properties: [
            { name: "id" }
          ]},
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: [
            { name: "status" },
            { name: "statusDate", type: "date_time", 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
            { name: "userId" }
          ]},
          { name: "additionalDeliveryInformation" },
          { name: "availability" },
          { name: "availabilityForAllWarehouses" },
          { name: "consolidationStoragePlaceId" },
          { name: "customerPurchaseOrderNumber" },
          { name: "declaredValueAmount" },
          { name: "declaredValueAmountCurrencyId", control_type: "select", 
            pick_list: "currencies",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "declaredValueAmountCurrencyId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid currency ID. For instance: '259'"
            }
          },
          { name: "declaredValueAmountCurrencyName" },
          { name: "deliveryDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "destinationStoragePlaceId" },
          { name: "destinationWarehouseId" },
          { name: "destinationWarehouseName" },
          { name: "invoiceRecipientId" },
          { name: "packageHeight" },
          { name: "packageLength" },
          { name: "packageReferenceNumber" },
          { name: "packageReturnTrackingNumber" },
          { name: "packageReturnTrackingUrl" },
          { name: "packageTrackingNumber" },
          { name: "packageTrackingUrl" },
          { name: "packageWeight" },
          { name: "packageWidth" },
          { name: "pickingInstructions" },
          { name: "picksComplete" },
          { name: "purchaseOrders", type: "array", of: "object", properties: [
            { name: "id" }
          ]},
          { name: "recipientCustomerNumber" },
          { name: "recipientPartyId" },
          { name: "recipientSupplierNumber" },
          { name: "recordEmailAddresses", type: "object", properties: [
            { name: "bccAddresses" },
            { name: "ccAddresses" },
            { name: "toAddresses" }
          ]},
          { name: "responsibleUserId" },
          { name: "salesInvoiceEmailAddresses", type: "object", properties: [
            { name: "bccAddresses" },
            { name: "ccAddresses" },
            { name: "toAddresses" }
          ]},
          {
            name: "shipmentItems", type: "array", of: "object", properties: [
              { name: "id" },
              { name: "createdDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "lastModifiedDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "version" },
              { name: "articleId" },
              { name: "articleNumber" },
              { name: "note" },
              { name: "positionNumber" },
              { name: "quantity" },
              { name: "description" },
              { name: "descriptionFixed" },
              { name: "manualQuantity" },
              { name: "parentItemId" },
              { name: "title" },
              { name: "unitId" },
              { name: "unitName" },
              { name: "addPageBreakBefore" },
              { name: "availability" },
              { name: "availabilityForAllWarehouses" },
              # { name: "customAttributes", type: "array", of: "object", properties: [] },
              { name: "freeTextItem" },
              { name: "groupName" },
              { name: "purchaseOrderItemId" },
              { name: "returnAssessmentId" },
              { name: "returnAssessmentName" },
              { name: "returnDescription" },
              { name: "returnErrorId" },
              { name: "returnErrorName" },
              { name: "returnReasonId" },
              { name: "returnReasonName" },
              { name: "returnRectificationId" },
              { name: "returnRectificationName" },
              { name: "salesOrderItemId" }
            ]
          },
          { name: "shipmentMethodId", control_type: "select",
            pick_list: "shipmentMethods",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "shipmentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid shipment method ID. For instance: '4183'"
            }
          },
          { name: "shipmentMethodName" },
          { name: "shipmentNumber" },
          { name: "shipmentType" },
          {  name: "shippedFromAddress", type: "object", properties: object_definitions['address'] },
          { name: "shippingCarrierId" },
          { name: "shippingCarrierName" },
          { name: "shippingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "shippingLabelsCount" },
          { name: "shippingReturnCarrierId" },
          { name: "shippingReturnCarrierName" },
          { name: "warehouseId", control_type: "select",
            pick_list: "warehouses", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "warehouseId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid warehouse ID. For instance: '3969'"
            }
          },
          { name: "warehouseName" }
        ]
      end
    },
    articleCategory: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" },
          { name: "name" },
          { name: "description" },
          { name: "imageId" },
          { name: "parentCategoryId" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    comment: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" },
          { name: "authorName" },
          { name: "authorUserId" },
          { name: "comment" },
          { name: "entityId" },
          { name: "entityName", control_type: "select", pick_list: "comment_entities",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "entityName",
              label: "Entity name",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "For instance 'shipment', 'article' or 'customer'. 
              See the <a href='https://www.weclapp.com/api' target='_blank'>API-Documentation</a>."
            }
          },
          { name: "htmlComment"},
          { name: "lastEditDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "parentCommentId" },
          { name: "privateComment", type: "boolean", control_type: "checkbox",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "privateComment",
              label: "Private comment",
              type: "boolean",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be 'true' or 'false'"
            }
          },
          { name: "publicComment", type: "boolean", control_type: "checkbox",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "publicComment",
              label: "Public comment",
              type: "boolean",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be 'true' or 'false'"
            }
          },
          { name: "solution", type: "boolean", control_type: "checkbox",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "solution",
              label: "Solution",
              type: "boolean",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be 'true' or 'false'"
            }
          },
          { name: "recipientUsers", type: "array", of: "object", properties: [
            { name: "id" }
          ] },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    salesOpenItem: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" },
          { name: "amount" },
          { name: "amountDiscount" },
          { name: "amountOpen" },
          { name: "amountPaid" },
          { name: "clearanceDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "cleared", type: "boolean", control_type: "checkbox" },
          { name: "openItemNumber" },
          { name: "openItemType", control_type: "select", pick_list: "sales_channels",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "openItemType",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid type. Allowed: 'CREDITOR', 'CREDITOR_INVERTED', 'CREDIT_ADVICE','CREDIT_ADVICE_INVERTED','CREDIT_NOTE_CREDITOR','CREDIT_NOTE_CREDITOR_INVERTED'"
            }
          },
          { name: "paymentApplications", type: "array", of: "object", properties: 
            [
              { name: "id" },
              { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "version" },
              { name: "amountApplied" },
              { name: "amountAppliedOriginCurrency" },
              { name: "amountCostsOfMonetaryTraffic" },
              { name: "amountDiscountApplied" },
              { name: "bankTransactionId" },
              { name: "cashTransactionId" },
              { name: "createdById" },
              { name: "moneyTransactionId" },
              { name: "openItemClearingId" }
            ]
          },
          { name: "salesInvoiceId" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    salesInvoice: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'salesInvoice')
        custom_props_items = call('create_custom_properties_schema', 'salesInvoiceItem')
        [
          { name: "id" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage", hint: "Must be a valid language. For instance: 'de'" },
          { name: "creatorId" },
          { name: "description" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient", type: "boolean", control_type: "checkbox" },
          { name: "tags", type: "array", of: "string" },
          { name: "currencyConversionDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "grossAmount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "headerDiscount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "headerSurcharge", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "netAmount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "netAmountInCompanyCurrency", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "nonStandardTaxId" },
          { name: "paymentMethodId", control_type: "select",
            pick_list: "paymentMethods", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "paymentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid payment method ID. For instance: '3721'"
            }
          },
          { name: "paymentMethodName" },
          { name: "recordCurrencyId", control_type: "select",
            pick_list: "currencies", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "recordCurrencyName",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid currency. For instance: 'EUR'"
            }
          },
          { name: "termOfPaymentId", control_type: "select",
            pick_list: "termOfPayments", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "termOfPaymentId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid term of payment ID. For instance: '3690'"
            }
          },
          { name: "termOfPaymentName" },
          { name: "commission" },
          { name: "commissionSalesPartners", type: "array", of: "object", properties: 
            [
              { name: "id" },
              { name: "commissionFix", type: "number", control_type: "number", 
                parse_output: "float_conversion", parse_intput: "float_conversion"
              },
              { name: "commissionPercentage", type: "number", control_type: "number", 
                parse_output: "float_conversion", parse_intput: "float_conversion"
              },
              { name: "commissionType" },
              { name: "salesPartnerSupplierId" },
              { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "version" }
            ]
          },
          { name: "customerId" },
          { name: "dispatchCountryCode" },
          { name: "factoring", type: "boolean", control_type: "checkbox" },
          { name: "pricingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "responsibleUserId" },
          { name: "salesChannel", control_type: "select", pick_list: "sales_channels",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "salesChannel",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid sales channel ID. For instance: 'NET1'"
            }
          },
          { name: "servicePeriodFrom", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "servicePeriodTo", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "shipmentMethodId", control_type: "select", pick_list: "shipmentMethods",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "shipmentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid shipment method ID. For instance: '3721'"
            }
          },
          { name: "shipmentMethodName" },
          { name: "bookingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "bookingText" },
          { name: "cancellationDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "cancellationNumber" },
          { name: "cancellationSlipCommissionBlock", type: "boolean", control_type: "checkbox" },
          { name: "cancellationSlipCommissionSettlementDone", type: "boolean", control_type: "checkbox" },
          { name: "collectiveInvoicePositionPrintType" },
          { name: "commissionBlock", type: "boolean", control_type: "checkbox" },
          { name: "commissionSettlementDone", type: "boolean", control_type: "checkbox" },
          { name: "costCenterId" },
          { name: "costTypeId" },
          { name: "creditResetsOrderState", type: "boolean", control_type: "checkbox" },
          { name: "customerHabitualExporterLetterOfIntentId" },
          { name: "deliveryAddress", type: "object", properties: object_definitions['address'] },
          { name: "deliveryDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "directDebitFileCreated", type: "boolean", control_type: "checkbox" },
          { name: "directDebitFileLatestDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "dueDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "dunningBlockDateUntilDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "dunningBlockNote" },
          { name: "dunningBlockState" },
          { name: "invoiceDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "invoiceNumber" },
          { name: "orderNumberAtCustomer" },
          { name: "paid", type: "boolean", control_type: "checkbox" },
          { name: "paymentStatus" },
          { name: "precedingSalesInvoiceId" },
          { name: "recordAddress", type: "object", properties: object_definitions['address'] },
          { name: "recordCommentInheritance", type: "boolean", control_type: "checkbox" },
          { name: "recordEmailAddresses", type: "object", properties: 
            [
              { name: "bccAddresses" },
              { name: "ccAddresses" },
              { name: "toAddresses" }
            ]
          },
          { name: "recordFreeTextInheritance", type: "boolean", control_type: "checkbox" },
          { name: "recordOpeningInheritance", type: "boolean", control_type: "checkbox" },
          { name: "salesInvoiceItems", type: "array", of: "object", properties: 
            [
              { name: "customAttributes", type: "object", properties: custom_props_items },
              { name: "articleId" },
              { name: "note" },
              { name: "positionNumber", type: "integer", control_type: "integer",
                parse_output: "integer_conversion", parse_input: "integer_conversion",
              },
              { name: "quantity", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "description" },
              { name: "descriptionFixed", type: "boolean", control_type: "checkbox" },
              { name: "itemType" },
              { name: "manualQuantity", type: "boolean", control_type: "checkbox" },
              { name: "parentItemId" },
              { name: "title" },
              { name: "unitId" },
              { name: "discountPercentage", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "manualUnitPrice", type: "boolean", control_type: "checkbox" },
              { name: "netAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountForStatistics", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountForStatisticsInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "reductionAdditionItems", type: "array", of: "object", properties: 
                [
                  { name: "position", control_type: "integer", type: "integer", 
                    parse_output: "integer_conversion", parse_input: "integer_conversion",
                  },
                  { name: "source" },
                  { name: "specialPriceReduction", type: "boolean", control_type: "checkbox" },
                  { name: "title" },
                  { name: "type" },
                  { name: "value", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  }
                ]
              },
              { name: "taxId" },
              { name: "unitPrice", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPriceInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "addPageBreakBefore", type: "boolean", control_type: "checkbox" },
              { name: "groupName" },
              { name: "commissionSalesPartners", type: "array", of: "object", properties: 
                [
                  { name: "commissionFix", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  },
                  { name: "commissionPercentage", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  },
                  { name: "commissionType" },
                  { name: "salesPartnerSupplierId" },
                  { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "version" }
                ]
              },
              { name: "manualUnitCost", type: "boolean", control_type: "checkbox" },
              { name: "recommendedRetailPrice", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "servicePeriodFrom", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "servicePeriodTo", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "unitCost", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitCostInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "accountId" },
              { name: "contractItemId" },
              { name: "cost2CostCenterId" },
              {
                name: "costCenterItems", type: "array", of: "object",  properties: 
                [
                  { name: "costCenterId" },
                  { name: "distributionPercentage", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  },
                  { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "version" }
                ]
              },
              { name: "costTypeId" },
              { name: "creditedInvoiceItemId" },
              { name: "deliveryDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "serialNumbers", type: "array", of: "string" },
              { name: "shippingDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "version" }
            ]
          },
          { name: "salesInvoiceType" },
          { name: "salesOrderId" },
          { name: "sepaDirectDebitMandateId" },
          { name: "shippingCostItems", type: "array", of: "object", properties: 
            [
              { name: "version" },
              { name: "articleId" },
              { name: "grossAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "manualUnitPrice", type: "boolean", control_type: "checkbox" },
              { name: "netAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPrice", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPriceInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },

              { name: "manualUnitCost", type: "boolean", control_type: "checkbox" },
              { name: "taxId" },
              { name: "unitCost", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion" },
              { name: "unitCostInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion" }
            ]
          },
          { name: "shippingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: 
            [
              { name: "status" },
              { name: "statusDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "userId" }
            ]
          },
          { name: "vatRegistrationNumber" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    purchaseInvoice: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'purchaseInvoice')
        custom_props_items = call('create_custom_properties_schema', 'purchaseInvoiceItem')
        [
          { name: "id" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage", hint: "Must be a valid language. For instance: 'de'" },
          { name: "creatorId" },
          { name: "description" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient", type: "boolean", control_type: "checkbox" },
          { name: "tags", type: "array", of: "string" },
          { name: "currencyConversionDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "grossAmount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "headerDiscount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "headerSurcharge", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "netAmount", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "netAmountInCompanyCurrency", type: "number", control_type: "number", 
            parse_output: "float_conversion", parse_intput: "float_conversion"
          },
          { name: "nonStandardTaxId" },
          { name: "paymentMethodId", control_type: "select",
            pick_list: "paymentMethods", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "paymentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid payment method ID. For instance: '3721'"
            }
          },
          { name: "paymentMethodName" },
          { name: "recordCurrencyId", control_type: "select",
            pick_list: "currencies", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "recordCurrencyName",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid currency. For instance: 'EUR'"
            }
          },
          { name: "termOfPaymentId", control_type: "select",
            pick_list: "termOfPayments", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "termOfPaymentId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid term of payment ID. For instance: '3690'"
            }
          },
          { name: "termOfPaymentName" },
          { name: "recordEmailAddresses", type: "object", properties: 
            [
              { name: "bccAddresses" },
              { name: "ccAddresses" },
              { name: "toAddresses" }
            ]
          },
          { name: "responsibleUserId" },
          { name: "servicePeriodFrom", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "servicePeriodTo", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "supplierId" },

          { name: "bookingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "bookingText" },
          { name: "cancellationDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "costCenterId" },
          { name: "costTypeId" },
          { name: "createdViaOcr", type: "boolean", control_type: "checkbox" },
          { name: "creditResetsOrderState", type: "boolean", control_type: "checkbox" },
          { name: "deliveryAddress", type: "object", properties: object_definitions['address'] },
          { name: "deliveryDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "dueDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },

          { name: "grossAmountOfHeaderTaxes", type: "number", control_type: "number",
            parse_output: "float_conversion", parse_input: "float_conversion",
          },
          { name: "grossAmountOfHeaderTaxesInCompanyCurrency", type: "number", control_type: "number",
            parse_output: "float_conversion", parse_input: "float_conversion",
          },
          { name: "grossPrices", type: "boolean", control_type: "checkbox" },
          { name: "importSalesTaxAmount", type: "number", control_type: "number",
            parse_output: "float_conversion", parse_input: "float_conversion",
          },
          { name: "importSalesTaxId" },
          { name: "internalInvoiceNumber" },
          { name: "invoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "invoiceDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "invoiceNumber" },
          { name: "paymentBlock", type: "boolean", control_type: "checkbox" },
          { name: "paymentBlockNote" },
          { name: "paymentStatus" },
          { name: "precedingPurchaseInvoiceId" },
          { name: "pricingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "purchaseInvoiceItems", type: "array", of: "object", properties: 
            [
              { name: "customAttributes", type: "object", properties: custom_props_items },
              { name: "articleId" },
              { name: "note" },
              { name: "positionNumber", type: "integer", control_type: "integer",
                parse_output: "integer_conversion", parse_input: "integer_conversion",
              },
              { name: "quantity", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "description" },
              { name: "descriptionFixed", type: "boolean", control_type: "checkbox" },
              { name: "itemType" },
              { name: "manualQuantity", type: "boolean", control_type: "checkbox" },
              { name: "parentItemId" },
              { name: "title" },
              { name: "unitId" },
              { name: "discountPercentage", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "manualUnitPrice", type: "boolean", control_type: "checkbox" },
              { name: "netAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountForStatistics", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountForStatisticsInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "reductionAdditionItems", type: "array", of: "object", properties: 
                [
                  { name: "position", control_type: "integer", type: "integer", 
                    parse_output: "integer_conversion", parse_input: "integer_conversion",
                  },
                  { name: "source" },
                  { name: "specialPriceReduction", type: "boolean", control_type: "checkbox" },
                  { name: "title" },
                  { name: "type" },
                  { name: "value", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  }
                ]
              },
              { name: "taxId" },
              { name: "unitPrice", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPriceInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "accountId" },
              { name: "contractItemId" },
              { name: "cost2CostCenterId" },
              {
                name: "costCenterItems", type: "array", of: "object",  properties: 
                [
                  { name: "costCenterId" },
                  { name: "distributionPercentage", type: "number", control_type: "number",
                    parse_output: "float_conversion", parse_input: "float_conversion",
                  },
                  { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
                  { name: "version" }
                ]
              },
              { name: "costTypeId" },
              { name: "creditedInvoiceItemId" },
              { name: "deliveryDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "servicePeriodFromDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "servicePeriodToDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "shippingDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" }
            ]
          },
          { name: "purchaseInvoiceType" },
          { name: "purchaseOrders", type: "array", of: "object", properties: [
            { name: "id" }
          ]},
          { name: "recipientCountryCode" },
          { name: "recordAddress", type: "array", of: "object", properties: object_definitions['address'] },
          { name: "senderCountryCode" },
          { name: "shippingCostItems", type: "array", of: "object", properties: 
            [
              { name: "version" },
              { name: "articleId" },
              { name: "grossAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "grossAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "manualUnitPrice", type: "boolean", control_type: "checkbox" },
              { name: "netAmount", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "netAmountInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPrice", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "unitPriceInCompanyCurrency", type: "number", control_type: "number",
                parse_output: "float_conversion", parse_input: "float_conversion",
              },
              { name: "taxId" },
            ]
          },
          { name: "shippingDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: 
            [
              { name: "status" },
              { name: "statusDate", type: "date_time", 
                convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
              { name: "userId" }
            ]
          },
          { name: "supplierHabitualExporterLetterOfIntentId" },
          { name: "vatRegistrationNumber" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    accountingTransaction: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" },
          { name: "accountingImportDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "conversionRate", type: "number", control_type: "number",
            parse_output: "float_conversion", parse_input: "float_conversion" },
          { name: "conversionRateDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "currencyId" },
          { name: "draft", type: "boolean", control_type: "checkbox" },
          { name: "externalRecordNumber" },
          { name: "internalRecordNumber" },
          { name: "reverseTransaction", type: "boolean", control_type: "checkbox" },
          { name: "status", control_type: "select", pick_list: [
            ["DRAFT","DRAFT"],
            ["ESTABLISHED","ESTABLISHED"],
            ["PREBATCHBOOKING","PREBATCHBOOKING"]
          ] },
          { name: "transactionDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "transactionDetails", type: "array", of: "object", properties: 
            [
              { name: "accountId" },
              { name: "amount" },
              { name: "debitCredit", control_type: "select", pick_list: [
                ["CREDIT","CREDIT"],
                ["DEBIT","DEBIT"]
              ] },
              { name: "description" },
              { name: "taxId" }
            ]
          },
          { name: "transactionEstablishDate", type: "date_time", 
            convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" },
          { name: "transactionNumber" },
          { name: "type" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    document: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        [
          { name: "id" },
          { name: "entityId" },
          { name: "entityName", control_type: "select", pick_list: "comment_entities",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "entityName",
              label: "Entity name",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "For instance 'shipment', 'article' or 'customer'. 
              See the <a href='https://www.weclapp.com/api' target='_blank'>API-Documentation</a>."
            }
          },
          { name: "description" },
          { name: "documentSize", control_type: "number", type: "number", parse_output: "float_conversion" },
          { name: "documentType" },
          { name: "mediaType" },
          { name: "name" },
          { name: "userId" },
          { name: "versions", type: "array", of: "object", properties: 
            [
              { name: "id" },
              { name: "comment" },
              { name: "documentSize", control_type: "number", type: "number", parse_output: "float_conversion" },
              { name: "documentVersion" },
              { name: "userId" },
              { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "version" }
            ]
          },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    },
    quotation: {
      fields: lambda do |_connection, _config_fields, object_definitions|
        custom_props = call('create_custom_properties_schema', 'quotation')
        custom_props_items = call('create_custom_properties_schema', 'quotationItem')
        [
          { name: "id" },
          { name: "customAttributes", type: "object", properties: custom_props },
          { name: "commercialLanguage" },
          { name: "creatorId" },
          { name: "description" },
          { name: "recordComment" },
          { name: "recordFreeText" },
          { name: "recordOpening" },
          { name: "sentToRecipient", type: "boolean" },
          { name: "tags", type: "array", of: "string" },
          { name: "currencyConversionDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "grossAmount" },
          { name: "grossAmountInCompanyCurrency" },
          { name: "headerDiscount" },
          { name: "headerSurcharge" },
          { name: "netAmount" },
          { name: "netAmountInCompanyCurrency" },
          { name: "nonStandardTaxId" },
          { name: "paymentMethodId", control_type: "select",
            pick_list: "paymentMethods", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "paymentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid payment method ID. For instance: '3721'"
            }
          },
          { name: "recordCurrencyId" },
          { name: "termOfPaymentId", control_type: "select",
            pick_list: "termOfPayments", 
            toggle_hint: "Select from list",
            toggle_field: {
              name: "termOfPaymentId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid term of payment ID. For instance: '3690'"
            }
          },
          { name: "commission" },
          { name: "commissionSalesPartners", type: "array", of: "object", 
            properties: object_definitions['commissionSalesPartners']
          },
          { name: "customerId" },
          { name: "dispatchCountryCode" },
          { name: "factoring", type: "boolean" },
          { name: "pricingDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "responsibleUserId" },
          { name: "salesChannel", control_type: "select", pick_list: "sales_channels",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "salesChannel",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid sales channel ID. For instance: 'NET1'"
            }
          },
          { name: "servicePeriodFrom", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "servicePeriodTo", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "shipmentMethodId", control_type: "select", pick_list: "shipmentMethods",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "shipmentMethodId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid shipment method ID. For instance: '3721'"
            }
          },
          { name: "defaultShippingCarrierId", control_type: "select", 
            pick_list: "shippingCarriers",
            toggle_hint: "Select from list",
            toggle_field: {
              name: "defaultShippingCarrierId",
              type: "string",
              control_type: "text",
              toggle_hint: "Use value",
              hint: "Must be a valid shipping carrier ID. For instance: '3721'"
            }
          },
          { name: "deliveryAddress", type: "object", properties: object_definitions['address'] },
          { name: "deliveryEmailAddresses", type: "object", properties: object_definitions['emails'] },
          { name: "invoiceAddress", type: "object", properties: object_definitions['address'] },
          { name: "plannedDeliveryDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "plannedShippingDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "recordAddress", type: "object", properties: object_definitions['address'] },
          { name: "salesInvoiceEmailAddresses", type: "object", properties: object_definitions['emails'] },
          { name: "activeVersion", type: "boolean" },
          { name: "expectedSignatureDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "invoiceRecipientId" },
          { name: "mergedToQuotationId" },
          { name: "opportunityId" },
          { name: "publicLink" },
          { name: "quotationDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "quotationItems", type: "array", of: "object", properties: 
            [
              { name: "id" },
              { name: "customAttributes", type: "object", properties: custom_props_items },
              { name: "articleId" },
              { name: "note" },
              { name: "positionNumber" },
              { name: "quantity" },
              { name: "description" },
              { name: "descriptionFixed", type: "boolean" },
              { name: "itemType" },
              { name: "manualQuantity", type: "boolean" },
              { name: "parentItemId" },
              { name: "title" },
              { name: "unitId" },
              { name: "discountPercentage" },
              { name: "grossAmount" },
              { name: "grossAmountInCompanyCurrency" },
              { name: "manualUnitPrice", type: "boolean" },
              { name: "netAmount" },
              { name: "netAmountForStatistics" },
              { name: "netAmountForStatisticsInCompanyCurrency" },
              { name: "netAmountInCompanyCurrency" },
              { name: "reductionAdditionItems", type: "array", of: "object", properties: 
                [
                  { name: "position" },
                  { name: "source" },
                  { name: "specialPriceReduction", type: "boolean" },
                  { name: "title" },
                  { name: "type" },
                  { name: "value" }
                ]
              },
              { name: "taxId" },
              { name: "unitPrice" },
              { name: "unitPriceInCompanyCurrency" },
              { name: "addPageBreakBefore", type: "boolean" },
              { name: "groupName" },
              { name: "commissionSalesPartners", type: "array", of: "object", properties: 
                [
                  { name: "id" },
                  { name: "commissionFix" },
                  { name: "commissionPercentage" },
                  { name: "commissionType" },
                  { name: "salesPartnerSupplierId" }
                ]
              },
              { name: "manualUnitCost", type: "boolean" },
              { name: "recommendedRetailPrice" },
              { name: "servicePeriodFrom", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "servicePeriodTo", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "unitCost" },
              { name: "unitCostInCompanyCurrency" },
              { name: "invoicingType" },
              { name: "manualPlannedWorkingTimePerUnit", type: "boolean" },
              { name: "plannedDeliveryDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "plannedShippingDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "plannedWorkingTimePerUnit" },
              { name: "alternative", type: "boolean" },
              { name: "itScopeId" },
              { name: "optional", type: "boolean" },
              { name: "scaleValues", type: "array", of: "object", properties: 
                [
                  { name: "discountPercentage" },
                  { name: "fromSalesPrice", type: "boolean" },
                  { name: "price" },
                  { name: "quantity" },
                  { name: "reductionAdditionItems", type: "array", of: "object", properties: 
                    [
                      { name: "position" },
                      { name: "source" },
                      { name: "specialPriceReduction", type: "boolean" },
                      { name: "title" },
                      { name: "type" },
                      { name: "value" }
                    ]
                  }
                ]
              },
              { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "version" }
            ]
          },
          { name: "quotationNumber" },
          { name: "quotationType" },
          { name: "quotationVersion" },
          { name: "recordCommentInheritance", type: "boolean" },
          { name: "recordEmailAddresses", type: "object", properties: object_definitions['emails'] },
          { name: "recordFreeTextInheritance", type: "boolean" },
          { name: "recordOpeningInheritance", type: "boolean" },
          { name: "rejectionReason" },
          { name: "requestDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "salesOrderEmailAddresses", type: "object", properties: object_definitions['emails'] },
          { name: "salesProbability" },
          { name: "salesStageHistory", type: "array", of: "object", properties: 
            [
              { name: "id" },
              { name: "salesStageId" },
              { name: "userId" },
              { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "version" }
            ]
          },
          { name: "salesStageId" },
          { name: "shippingCostItems", type: "array", of: "object", properties: object_definitions['shippingCostItems']},
          { name: "status" },
          { name: "statusHistory", type: "array", of: "object", properties: 
            [
              { name: "status" },
              { name: "statusDate", type: "date_time", convert_output: "epoch_time_conversion" },
              { name: "userId" }
            ]
          },
          { name: "template", type: "boolean" },
          { name: "validFrom", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "validTo", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "warehouseId" },
          { name: "createdDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "lastModifiedDate", type: "date_time", convert_output: "epoch_time_conversion" },
          { name: "version" }
        ]
      end
    }
  },

  custom_action: true,

  custom_action_help: {
    learn_more_url: "https://your-webclapp-domain.weclapp.com/webapp/view/api/",
    learn_more_text: "weclapp API documentation",
    body: "<p>Build your own API action with a HTTP request. The request will be authorized with your weclapp API connection.</p>"
  },

  actions: {
    get_record_by_id: {
      title: "Get record by ID",
      subtitle: "Retrieves the details of the selected object type, such as an article, by ID.",
      description: lambda do |_input, picklist_label|
        "Get <span class='provider'>" \
          "#{picklist_label['object'] || 'record'}</span> " \
          "by ID from <span class='provider'>weclapp</span>"
      end,

      config_fields: [
        { name: "object", label: "Object", control_type: 'select', pick_list: "get_objects", optional: false }
      ],

      input_fields: lambda do |object_definitions, connection, config_fields|
        # Special handling for article information to obtain additional information
        object = parse_json(config_fields['object'])
        if object['entityName'] == "article"
          [ 
            { name: "id", label: "Object ID", optional: false },
            { 
              name: "extraInfo", label: "Article extra info", control_type: "checkbox", sticky: true,
              extends_schema: true, hint: "Load extra information for the given article" 
            }
          ]
        else
          [ 
            { name: "id", label: "Object ID", optional: false }
          ]
        end
      end,

      execute: lambda do |_connection, _input, _input_schema, _output_schema|
        object = parse_json(_input['object'])
        response = get("#{object['entityName']}/id/#{_input['id']}")
        call('parse_custom_properties', response)
        # Special handling for article information to obtain additional information
        if object['entityName'] == "article" && _input['extraInfo'] == "true"
          extraInfo = get("article/id/#{_input['id']}/extraInfoForApp")
          response['extraInfo'] = extraInfo&.dig('result')
        end
        response
      end,

      output_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        object_definitions[object['entityName']].ignored(*object['ignoredOutputFields'])
      end,

      sample_output: lambda do |_connection, _input|
        object = parse_json(_input['object'])
        get(object['entityName']).params(pageSize: 1, sort: '-lastModifiedDate').dig("result").first
      end
    },
    create_record: {
      title: "Create record",
      subtitle: "Creates a new record of the chosen object type, such as an article, in webclapp.",
      description: lambda do |_input, picklist_label|
        "Create <span class='provider'>" \
          "#{picklist_label['object'] || 'record'}</span> " \
          "in <span class='provider'>weclapp</span>"
      end,

      config_fields: [
        { name: "object", label: "Object", control_type: 'select', pick_list: "objects", optional: false }
      ],

      input_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        object_definitions[object['entityName']].
          required(*object['requiredCreateFields']).
          ignored("id", *object['ignoredCreateFields'])
      end,

      execute: lambda do |_connection, _input, _input_schema, _output_schema|
        object = parse_json(_input['object'])
        _input['customAttributes'] = call('create_custom_propeties', _input, _input_schema)
        response = post("#{object['entityName']}").
          params(ignoreMissingProperties:true).
          payload( _input.except("object").compact ).
          after_error_response(/.*/) do |code, body, header, message|
            error("#{message}: #{body}")
          end
        response
      end,

      output_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        object_definitions[object['entityName']]
      end,

      sample_output: lambda do |_connection, _input|
        object = parse_json(_input['object'])
        get(object['entityName']).params(pageSize: 1, sort: '-lastModifiedDate').dig("result").first
      end
    },
    update_record: {
      title: "Update record",
      subtitle: "Creates an existing record of the chosen object type, such as an contact, in webclapp.",
      description: lambda do |_input, picklist_label|
        "Update <span class='provider'>" \
          "#{picklist_label['object'] || 'object'}</span> " \
          "in <span class='provider'>weclapp</span>"
      end,

      config_fields: [
        { name: "object", label: "Object", control_type: 'select', pick_list: "objects", optional: false }
      ],

      input_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        object_definitions[object['entityName']].
          required("id", *object['requiredUpdateFields']).
          ignored(*object['ignoredUpdateFields'])
      end,

      execute: lambda do |_connection, _input, _input_schema, _output_schema|
        object = parse_json(_input['object'])
        _input['customAttributes'] = call('create_custom_propeties', _input, _input_schema)
        response = put("#{object['entityName']}/id/#{_input['id']}").
          params(ignoreMissingProperties:true).
          payload( _input.except("id", "object") ).
          after_error_response(/.*/) do |code, body, header, message|
            error("#{message}: #{body}")
          end
        response
      end,

      output_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        object_definitions[object['entityName']]
      end,

      sample_output: lambda do |_connection, _input|
        object = parse_json(_input['object'])
        get(object['entityName']).params(pageSize: 1, sort: '-lastModifiedDate').dig("result").first
      end
    },
    search_records: {
      batch: true,
      title: "Search records",
      subtitle: "Search for objects, such as articles in weclapp, using various search criteria.",
      help: lambda do |input, picklist_label|
        'You can filter by each property of the selected object. ' \
          'If you specify a value for more than one property, the values are combined using a logical AND. ' \
          'The comparison operator is always equal.</br>' \
          'By using the query parameter, you can define your own query and ' \
          'flexibly filter entries with the help of other operators. ' \
          'To learn more see weclapps API-Documentation: https://<your-domain>.weclapp.com/webapp/view/api/#overview--filtering'
      end,
      description: lambda do |_input, picklist_label|
        "Search <span class='provider'>" \
          "#{picklist_label['object'] || 'object'}</span> " \
          "in <span class='provider'>weclapp</span>"
      end,

      config_fields: [
        { name: "object", label: "Object", control_type: 'select', pick_list: "get_objects", optional: false }
      ],

      input_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        [ 
          { 
            name: "custom_query", sticky: true, 
            hint: "Use your own query to filter specific records. " \
              "It will be combined with any other given property value.</br>" \
              "For instance: salesChannel-eq=NET1&createdDate-gt=1398436281262. "
          }, 
          { 
            name: "pageSize", sticky: true,
            hint: "By default the operation will not return all entity instances but only the first 100, this can be changed by using the page size parameter with the number of desired results. But page size cannot be arbitrarily high it is usually limited 1000."
          },
          { 
            name: "page", sticky: true,
            hint: "The page to be returned for the search operation"
          },
          { 
            name: "sort", sticky: true,
            hint: "It is also possible to change the order of the returned results using the sort parameter. " \
              "For example: 'lastModifiedDate' or '-lastModifiedDate' to sort by lastModifiedDate descending.</br>" \
              "You can also use multiple sort parameters. For example: 'lastModifiedDate,-salesChannel'"
          }
        ].concat(object_definitions[object['entityName']]).
          required(*object['requiredSearchFields'])
      end,

      execute: lambda do |_connection, _input, _input_schema, _output_schema|
        object = parse_json(_input['object'])
        filter_params = call('create_filter_params', 
          _input.except("object", "custom_query", "pageSize", "page", "sort", "entityName", "entityId"))
        results = get("#{object['entityName']}?#{_input['custom_query']}").
          params(filter_params.
              merge(_input.slice("pageSize", "page", "sort", "entityName", "entityId")))
        .dig('result')
        results.each { |entity| call('parse_custom_properties', entity) }
        { records: results }
      end,

      output_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        [
          { name: "records", type: "array", of: "object", properties: 
            object_definitions[object['entityName']].ignored(*object['ignoredOutputFields']) 
          }
        ]        
      end,

      sample_output: lambda do |connection, input|
        object = parse_json(input['object'])
        { records: [
          get(object['entityName']).params(pageSize: 1, sort: '-lastModifiedDate').dig("result").first  
        ] }
      end
    }
  },

  triggers: {
    new_updated_record: {
      title: 'New/updated record',

      subtitle: "Triggers when a record is " \
        "created or updated in weclapp",

      description: lambda do |_input, picklist_label|
        "New/Updated <span class='provider'>" \
          "#{picklist_label['object'] || 'record'}</span> " \
          "in <span class='provider'>weclapp</span>"
      end,

      config_fields: [
        { name: "object", label: "Object", control_type: 'select', pick_list: "get_objects", optional: false }
      ],

      input_fields: lambda do
        [
          {
            name: 'since',
            type: :timestamp,
            optional: false
          }
        ]
      end,

      poll: lambda do |connection, input, closure, _eis, _eos|
        object = parse_json(input['object'])
        closure = {} unless closure.present?
        page_size = 100
        updated_since = (closure['cursor'] || input['since'].to_i * 1000 || Time.now.to_i * 1000 )

        response = get(object['entityName']).
          params(sort: '-lastModifiedDate', pageSize: page_size, "lastModifiedDate-gt": updated_since).
          dig('result')
        response.each { |entity| call('parse_custom_properties', entity) }

        closure['cursor'] = response.last['lastModifiedDate'] unless response.blank?

        {
          events: response,
          next_poll: closure,
          can_poll_more: response.length >= page_size
        }
      end,

      webhook_subscribe: lambda do |webhook_url, connection, input, recipe_id|
        object = parse_json(input['object'])
        post("webhook").payload(
          { atCreate: true, atUpdate: true, entityName: object['entityName'], url: webhook_url }
        )
      end,

      webhook_unsubscribe: lambda do |webhook_subscribe_output, connection|
        delete("webhook/id/#{webhook_subscribe_output['id']}")
      end,

      dedup: lambda do |record|
        "#{record['id']}@#{record['lastModifiedDate']}"
      end,

      output_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        object_definitions[object['entityName']]
      end,

      sample_output: lambda do |connection, input|
        object = parse_json(input['object'])
        get(object['entityName']).params(pageSize: 1, sort: '-lastModifiedDate').dig("result").first
      end
    },
    new_updated_record_batch: {
      batch: true,
      title: 'New/updated records',
      subtitle: "Triggers when a number of records are " \
        "created or updated in weclapp",

      description: lambda do |_input, picklist_label|
        "New/Updated <span class='provider'>" \
          "#{picklist_label['object'] || 'records'}</span> " \
          "in <span class='provider'>weclapp</span>"
      end,

      config_fields: [
        { name: "object", label: "Object", control_type: 'select', pick_list: "get_objects", optional: false }
      ],

      input_fields: lambda do
        [
          { name: 'since', type: :timestamp, optional: false },
          { 
            name: 'batch_size', type: "integer", control_type: 'integer', sticky: true, 
            hint: 'Controls how many records should be processed in one batch. Maximum is 1.000 and defaults to 100.' 
          }
        ]
      end,

      poll: lambda do |connection, input, closure, _eis, _eos|
        object = parse_json(input['object'])
        closure = {} unless closure.present?
        page_size = input['batch_size'].to_i || 100
        updated_since = (closure['cursor'] || input['since'].to_i * 1000 || Time.now.to_i * 1000 )

        response = get(object['entityName']).
          params(sort: '-lastModifiedDate', pageSize: page_size, "lastModifiedDate-gt": updated_since).
          dig('result')
        response.each { |entity| call('parse_custom_properties', entity) }

        closure['cursor'] = response.last['lastModifiedDate'] unless response.blank?

        {
          events: { records: response },
          next_poll: closure,
          can_poll_more: response.length >= page_size
        }
      end,

      dedup: lambda do |record|
        Time.now.utc
      end,

      output_fields: lambda do |object_definitions, connection, config_fields|
        object = parse_json(config_fields['object'])
        [
          { name: "records", type: "array", of: "object", properties: object_definitions[object['entityName']] }
        ]        
      end,

      sample_output: lambda do |connection, input|
        object = parse_json(input['object'])
        { records: [
          get(object['entityName']).params(pageSize: 1, sort: '-lastModifiedDate').dig("result").first  
        ] }
      end
    }
  },

  methods: {
    epoch_time_conversion: lambda do |val|
      Time.at(val / 1000.0)
    end,

    time_epoch_conversion: lambda do |val|
      val.to_time.to_i * 1000
    end,

    # Creates a list of custom properties for the selected object
    create_custom_properties_schema: lambda do |object_name|
      configured_props = get('customAttributeDefinition').params(pageSize: 1000).
        dig('result').
        select { |property| property['entities'].include?(object_name) }.
        map do |obj_prop| 
          name = "customAttribute#{obj_prop['id']}"
          hint = "#{obj_prop['attributeDescription']} "
          group = obj_prop['groupName'] ? " (Group: #{obj_prop['groupName']})" : ""
          label = obj_prop['label']+group
          case obj_prop['attributeType']
          when 'DATE'
            { name: name, label: label, type: "date", control_type: "date", hint: hint, 
              convert_output: "epoch_time_conversion", convert_input: "time_epoch_conversion" }
          when 'DECIMAL'
            { name: name, label: label, type: "number", control_type: "number", hint: hint }
          when 'INTEGER'
            { name: name, label: label, type: "integer", control_type: "integer", hint: hint }
          when 'BOOLEAN'
            { name: name, label: label, type: "boolean", control_type: "checkbox", hint: hint,
              convert_output: "boolean_conversion", convert_input: "boolean_conversion",
              toggle_hint: "Select from list",
              toggle_field: {
                name: name,
                label: label,
                type: "boolean",
                control_type: "text",
                toggle_hint: "Use value",
                hint: "Must be 'true' or 'false'"
              }
            }
          when 'ENTITY'
            { name: name, label: label, type: "integer", control_type: "integer", 
              hint: "#{hint}Must be the ID of the entity type: #{obj_prop['attributeEntityType']}" }
          when 'LIST', 'MULTISELECT_LIST'
            pick_list = obj_prop['selectableValues'].map { |v| [ v['value'], v['id'] ] }
            allowed_values = obj_prop['selectableValues'].map { |v| "#{v['id']} (#{v['value']})" }
            control_type = obj_prop['attributeType'] == 'LIST' ? "select" : "multiselect"
            { name: name, label: label, control_type: control_type, pick_list: pick_list, 
              delimiter: ",", hint: hint, 
              toggle_hint: "Select from list",
              toggle_field: {
                name: name,
                label: label,
                type: "boolean",
                control_type: "text",
                toggle_hint: "Use ID",
                hint: "Allowed values: #{allowed_values.join(", ")}. For a multi-select field separate the values by comma."
              }
            }
          when 'REFERENCE'
            { name: name, label: label, type: "array", of: "object", hint: hint, properties: [
              { name: "entityId", hint: "The ID of the referenced entity." },
              { name: "entityName", hint: "The name of the referenced entity." },
            ] }
          else # Default for STRING, ENTITY and URL
            { name: name, label: label, hint: hint }
          end
        end
      configured_props
    end,

    # Used when creating/updating an existing object
    create_custom_propeties: lambda do |input, input_schema|
      customAttributesSchema = input_schema.select { |entry| entry['name'] == "customAttributes" }.first
      input['customAttributes']&.map do |key,value|
        customPropSchema = customAttributesSchema['properties'].select { |prop| prop['name'] == key }.first
        attribute_definition_id = key.match(/\d+/)[0]
        puts customPropSchema.to_json
        case customPropSchema['control_type']
        when 'select'
          valueKey = 'selectedValueId'
        when 'multiselect'
          valueKey = 'selectedValues'
          value = value.split(",").map { |val| { id: val } }
        when 'date'
          valueKey = 'dateValue'
        when 'number', 'integer'
          valueKey = 'numberValue'
        when 'checkbox'
          valueKey = 'booleanValue'
        else
          if customPropSchema['type'] == 'array' # An array is used for custom property type: Reference field
            valueKey = "entityReferences"
          else
            valueKey = "stringValue"
          end
        end
        {
          "attributeDefinitionId" => attribute_definition_id,
          valueKey => value
        }
      end
    end,

    # Used to parse the received LIST of custom properties into the internally declared schema
    parse_custom_properties: lambda do |response|
      result = response['customAttributes'] = response['customAttributes']&.each_with_object({}) do |attribute, result|
        value = 
        if attribute['stringValue']
          attribute['stringValue']
        elsif attribute['dateValue']
          attribute['dateValue']
        elsif attribute['numberValue']
          attribute['numberValue']
        elsif attribute['booleanValue']
          attribute['booleanValue']
        elsif attribute['selectedValueId']
          attribute['selectedValueId']
        elsif attribute['selectedValues']
          attribute['selectedValues'].map { |val| val['id'] }.join(",")
        elsif attribute['entityReferences']
          attribute['entityReferences']
        elsif attribute['entityId']
          attribute['entityId']
        else
          nil
        end

        attributeName = 'customAttribute'+attribute['attributeDefinitionId'].to_s
        result[attributeName] = value
      end
      result
    end,

    create_filter_params: lambda do |input|
      input.each_with_object({}) do |(key, value), result|
        if key == "customAttributes"
          value.map do |k, v|
            result["#{k}-eq"] = v
          end
        else
          result["#{key}-eq"] = value
        end
      end
    end
  },

  pick_lists: {
    # entityName:  Mainly used for the API-Communication
    objects: lambda do
      party = {
        entityName: "party",
        ignoredUpdateFields: ["customerCategoryName", "sectorName", "ratingName", "leadSourceName", "leadRatingName", "shipmentMethodName"],
        ignoredCreateFields: ["customerCategoryName", "sectorName", "ratingName", "leadSourceName", "leadRatingName"]
      }
      article = {
        entityName: "article",
        ignoredUpdateFields: ["customsTariffNumber", "manufacturerName"],
        ignoredCreateFields: ["customsTariffNumber", "manufacturerName"]
      }
      salesOrder = {
        entityName: "salesOrder",
        requiredCreateFields: ["customerId"],
        ignoredCreateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName", "recordCurrencyId", "nonStandardTaxName", "taxName", "defaultShippingCarrierName"],
        requiredUpdateFields: ["salesChannel"],
        ignoredUpdateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName", "recordCurrencyId", "nonStandardTaxName", "taxName", "defaultShippingCarrierName"]
      }
      purchaseOrder = {
        entityName: "purchaseOrder",
        requiredCreateFields: ["supplierId"],
        ignoredCreateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName"],
        ignoredUpdateFields: ["paymentMethodName", "termOfPaymentName"],
      }
      incomingGoods = {
        entityName: "incomingGoods",
#         requiredCreateFields: ["supplierId"],
#         ignoredCreateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName"],
#         ignoredUpdateFields: ["paymentMethodName", "termOfPaymentName"],
      }
      shipment = {
        entityName: "shipment",
        ignoredCreateFields: ["shipmentMethodName", "declaredValueAmountCurrencyName", "warehouseName"],
        ignoredUpdateFields: ["shipmentMethodName", "declaredValueAmountCurrencyName", "warehouseName"]
      }
      articleCategory = {
        entityName: "articleCategory",
        requiredCreateFields: ["name"]
      }
      comment = {
        entityName: "comment",
        requiredCreateFields: ["entityName", "entityId", "comment" ],
        requiredSearchFields: ["entityName", "entityId" ],
        ignoredUpdateFields: ["lastEditDate", "createdDate", "lastModifiedDate", "version"]
      }
      salesOpenItem = {
        entityName: "salesOpenItem",
        requiredCreateFields: ["moneyTransactionId"],
        ignoredCreateFields: [""],
        ignoredUpdateFields: [""],
      }
      salesInvoice = {
        entityName: "salesInvoice",
        requiredCreateFields: ["customerId"],
        ignoredCreateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName"],
        ignoredUpdateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName"],
      }
      quotation = {
        entityName: "quotation",
        requiredCreateFields: ["customerId", "salesChannel"]
      }
      purchaseInvoice = {
        entityName: "purchaseInvoice",
        requiredCreateFields: ["supplierId"],
        ignoredCreateFields: ["shipmentMethodName", "paymentMethodName", "termOfPaymentName"],
        ignoredUpdateFields: ["paymentMethodName", "termOfPaymentName"],
      }

      [
        [ "Article", article.to_json ],
        [ "Article category", articleCategory.to_json ],
        [ "Comment", comment.to_json ],
        [ "Quotation", quotation.to_json ],
        [ "Sales-Open-Item", salesOpenItem.to_json ],
        [ "Sales-Order", salesOrder.to_json ],
        [ "Sales-Invoice", salesInvoice.to_json ],
        [ "Purchase-Invoice", purchaseInvoice.to_json],
        [ "Shipment", shipment.to_json ],
        [ "Party (Customer/Contact)", party.to_json ],
        [ "Purchase-Order", purchaseOrder.to_json ],
        [ "Incoming-Goods", incomingGoods.to_json ],
      ]
    end,
    get_objects: lambda do
      party = {
        entityName: "party"
      }
      article = {
        entityName: "article"
      }
      salesOrder = {
        entityName: "salesOrder"
      }
      shipment = {
        entityName: "shipment"
      }
      articleCategory = {
        entityName: "articleCategory"
      }
      comment = {
        entityName: "comment",
        requiredSearchFields: ["entityName", "entityId" ]
      }
      salesOpenItem = {
        entityName: "salesOpenItem"
      }
      salesInvoice = {
        entityName: "salesInvoice"
      }
      purchaseInvoice = {
        entityName: "purchaseInvoice"
      }
      accountingTransaction = {
        entityName: "accountingTransaction",
      }
      document = {
        entityName: "document",
        requiredSearchFields: ["entityName", "entityId" ],
        ignoredOutputFields: ["entityName", "entityId" ],
      }
      quotation = {
        entityName: "quotation"
      }
      incomingGoods = {
        entityName: "incomingGoods"
      }
      purchaseOrder = {
        entityName: "purchaseOrder"
      }

      [
        [ "Accounting transaction", accountingTransaction.to_json ],
        [ "Article", article.to_json ],
        [ "Article category", articleCategory.to_json ],
        [ "Comment", comment.to_json ],
        [ "Sales-Open-Item", salesOpenItem.to_json ],
        [ "Purchase-Order", purchaseOrder.to_json ],
        [ "Incoming-Goods", incomingGoods.to_json ],
        [ "Document", document.to_json ],
        [ "Quotation", quotation.to_json ],
        [ "Sales-Order", salesOrder.to_json ],
        [ "Sales-Invoice", salesInvoice.to_json ],
        [ "Purchase-Invoice", purchaseInvoice.to_json],
        [ "Shipment", shipment.to_json ],
        [ "Party (Customer/Contact)", party.to_json ],
      ]
    end,
    comment_entities: lambda do
      [
        [ "Shipment", "shipment" ],
        [ "Sales Order", "salesOrder" ]
      ]
    end,
    sales_channels: lambda do
      get("salesChannel/activeSalesChannels").dig('result').
        map { |e| [ "#{e['name']} (#{e['key']})", e['key']]}
    end,
    customs_tariff_numbers: lambda do
      get("customsTariffNumber").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    article_categories: lambda do
      get("articleCategory").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    manufacturers: lambda do
      get("manufacturer").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    tags: lambda do
      get("tag").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    commercialLanguages: lambda do
      get("commercialLanguage").dig('result').
        map { |e| [ "#{e['languageCode']} (#{e['id']})", e['id']]}
    end,
    shipmentMethods: lambda do
      get("shipmentMethod").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    currencies: lambda do
      get("currency").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    warehouses: lambda do
      get("warehouse").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    paymentMethods: lambda do
      get("paymentMethod").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    termOfPayments: lambda do
      get("termOfPayment").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    customerCategories: lambda do
      get("customerCategory").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    personDepartments: lambda do
      get("personDepartment").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    personRoles: lambda do
      get("personRole").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    customerTopics: lambda do
      get("customerTopic").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    sectors: lambda do
      get("sector").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    partyRatings: lambda do
      get("partyRating").dig('result').
        map { |e| [ "#{e['name']} - #{e['description']} (#{e['id']})", e['id']]}
    end,
    leadSources: lambda do
      get("leadSource").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    leadRatings: lambda do
      get("leadRating").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    taxes: lambda do
      get("tax").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    shipmentMethods: lambda do
      get("shipmentMethod").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    fulfillmentProviders: lambda do
      get("fulfillmentProvider").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end,
    shippingCarriers: lambda do
      get("shippingCarrier").dig('result').
        map { |e| [ "#{e['name']} (#{e['id']})", e['id']]}
    end
  }
}