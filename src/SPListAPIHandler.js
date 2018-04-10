import React, { Component } from "react";

export default class SPListAPIHandler {
  constructor() {
    this.cols = [];
    //this.colMachineNames = [];
    //this.items = [];
    //this.listTitle = listTitle;
    //this.errorCallback = errorCallback;
  //  this.successCallback = successCallback;
  }

/*  getItems(){
    //https://analytics-dev.asu.edu/training/_api/Web/Lists/getByTitle('Data%20Source%20Connection%20Info')/items
    //console.log('/training/_api/Web/Lists/getByTitle(\'' + this.listTitle + '\')/items?select=' + this.colMachineNames.join());
      $.ajax({
            url: '/training/_api/Web/Lists/getByTitle(\'' + this.listTitle + '\')/items?$select=' + this.colMachineNames.join(),
            type: 'GET',
            contentType: 'application/json;odata=verbose',
            // request JSON type from server. By default XML is returned
            headers: { 'accept': 'application/json;odata=verbose' },
            success: (function(data) {
              this.items = data.d.results;  //need to make sure result is a primitive type or it won't work
              this.successCallback();
            }).bind(this),
            error: (function(xhr, status, err) {
              console.error(status, err.toString());
              this.errorCallback;
            }).bind(this)
          }); // end AJAX query
  }

  getCols(){
    $.ajax({
            //return only custom fields or the 'title' field
            url: '/training/_api/Web/Lists/getByTitle(\'' + this.listTitle + '\')/fields?$filter=FromBaseType%20eq%20false%20or%20InternalName%20eq%20%27Title%27',
            type: 'GET',
            contentType: 'application/json;odata=verbose',
            // request JSON type from server. By default XML is returned
            headers: { 'accept': 'application/json;odata=verbose' },
            success: (function(data) {
              //maping the returned object to what datatables is expecting for columns prop
              this.cols = data.d.results.map(col=> {
                if(data.d.results[0].InternalName == col.InternalName){
                  //if first column and 3 or fewer keys exist, assume it is child table and add styles
                  return ({
                  key: col.InternalName,
                  label: col.Title,
                  sortable: true,
                  tooltip: col.Description,
                  //className: 'important-column',
                  style: {
                    whiteSpace: 'normal',
                  },
                  render: (col, row) => (Object.keys(row).length < 4) ? <div id={'childTable'}
                                                                          style={{position:'relative',zIndex:'10',}}>{col}</div>
                                                                  : <div dangerouslySetInnerHTML={{__html: col}} />
                });
              }
              else{
                //any other col
                return ({
                  key: col.InternalName,
                  label: col.Title,
                  sortable: true,
                  tooltip: col.Description,
                  //className: 'important-column',
                  style: {
                    whiteSpace: 'normal',
                  },
                  render: (col, row) => <div dangerouslySetInnerHTML={{__html: col}} />
                });
              }
            });
            //make array of property keys that can be used in the odata select in getItems()
            this.colMachineNames = data.d.results.map(item => item.InternalName);
            this.getItems();
          }).bind(this),
            error: (function(xhr, status, err) {
              console.error(status, err.toString());
              this.errorCallback;
            }).bind(this)
          }); // end AJAX query
  } */

 /* below modified from https://sharepoint.stackexchange.com/questions/135936/how-to-get-all-items-in-a-view-using-rest-api/136002 */
  executeJson(url,method = 'GET',payload,headers = {})
  {
      headers["Accept"] = "application/json;odata=verbose";
      if(method == "POST") {
          headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val();
      }
      var ajaxOptions =
      {
         url: url,
         type: method,
         contentType: "application/json;odata=verbose",
         headers: headers
      };
      if (typeof payload != 'undefined') {
        ajaxOptions.data = JSON.stringify(payload);
      }
      return $.ajax(ajaxOptions);
  }

  getListItems(webUrl, listTitle, queryText = '', odataQuery = '')
  {   //gets all items from sp list with optional caml query and odata query
      var viewXml = '<View><Query>' + queryText + '</Query></View>';
      var url = webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/getitems" + odataQuery;
      var queryPayload = {
                 'query' : {
                        '__metadata': { 'type': 'SP.CamlQuery' },
                        'ViewXml' : viewXml
                 }
      };
      return this.executeJson(url,"POST",queryPayload);
  }

  getListViewItems(webUrl,listTitle,viewTitle = 'All Items', odataFilter = '')
  {   //gets all items from a list view with option view title and odata filter
       var url = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Views/getbytitle('" + viewTitle + "')/ViewQuery";
       return this.executeJson(url).then(
           (function(data){
               var viewQuery = data.d.ViewQuery;
               return this.getListViewFields(webUrl,listTitle,viewTitle,viewQuery,odataFilter);
           }).bind(this));
  }

  getListViewFields(webUrl,listTitle,viewTitle = 'All Items', queryText = '', odataFilter = '')
  {    //gets the fields and items from a list view with optional caml query and odata filter
        var url = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Views/getbytitle('" + viewTitle + "')/ViewFields"
        return this.executeJson(url).then(
            (function(data){
                this.getFieldCollection(webUrl,listTitle,data.d.Items.results);
                var odataQuery = '?$select=' + data.d.Items.results.join(); //build select query
                odataQuery += '&' + odataFilter;
                return this.getListItems(webUrl,listTitle,queryText,odataQuery);
            }).bind(this));
  }

  getFieldCollection(webUrl,listTitle,fields)
  {   //gets the field details from an array of fields
      var url = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/fields?$filter=(InternalName eq '" + fields.join("')or(InternalName eq '") + "')";
      return this.executeJson(url).then(
          (function(data){
              this.cols = data.d.results;
          }).bind(this));
  }

}
