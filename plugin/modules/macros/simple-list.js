/*\
title: $:/plugins/sebastianovide/gsebd/modules/macros/simple-list.js
type: application/javascript
module-type: macro

Write a simple list filter by a list of tags and with a + button in the header to create a new item.

@tags: is a list of tags coma separated. It accept spaces

\*/

(function(){
  exports.name = "gsebd-simple-list";

  exports.params = [
      {name: "title"},
      {name: "tags"},
      {name: "excludeCurrent"},
      {name: "addButton"},
      {name: "defaultValue"},
      {name: "showBrief"},
      {name: "fields"},
      {name: "filter"}
  ];

  exports.run = function(title, tags, excludeCurrent, addButton, defaultValue, showBrief, fields, filter) {
    const currentTiddler = this.getVariable("currentTiddler")
    if (!excludeCurrent) {
      tags += "," + currentTiddler
    }
    tags = tags.split(",").map(s => s.trim())
    
    const tag = tags[0]
    const tagsTW = tags.reduce((r, v) => r + (r === "" ? "" : " " ) + "[[" + v + "]]", "");
    const filterTags = tags.reduce((r, v) => r + (r === "" ? "" : " +" ) + "[tag[" + v + "]]", "");
    const filterTW = filter || filterTags;
    const tmpNewTiddlerField = `new_${currentTiddler}_${title}`.replace(/ /g,"_");
    const titleWT = title !== "" ? `<strong>${title}</strong><hr/>` : ""
    
    const saveActionsWT = `
    <$action-createtiddler
        $basetitle={{$/tmp!!${tmpNewTiddlerField}}}
        tags="${tagsTW}"
        ${fields}
    />
    <$action-deletefield $tiddler="$/tmp" $field="${tmpNewTiddlerField}"/>`;
    // <$action-setfield $tiddler="$/tmp" $field="${tmpNewTiddlerField}" $value="${defaultValue}"/>`;

    // TODO: I don't know how to make the "default value" to work
    const addButtonWT = addButton || `
      <$keyboard key="enter" actions="""${saveActionsWT}""">
        <$edit-text tiddler="$/tmp" field="${tmpNewTiddlerField}" type="text" size="40" placeholder="enter a new ${title} here" default="${defaultValue}"/> 
      </$keyboard>`;
  
    // TODO: show only part of it... a brief
    const briefWT = showBrief ? `
    <span>
    <$view/>
    </span>` : "";
  
    const finalWT = `
      ${titleWT}
      
      <div>
        <$list filter="${filterTW} +[!has[draft.of]]">          
          <$set name="goalClass" filter="[is[current]tag[Goal]]" value="list-item goal" emptyValue="list-item">        
            <div class=<<goalClass>>>
              <$transclude tiddler="$:/plugins/sebastianovide/gsebd/ui/lists/ListViewPrefix"/>
              <span class="list-link"><$link to={{!!title}}><$view field="title"/></$link>${briefWT}</span>
              <$transclude tiddler="$:/plugins/sebastianovide/gsebd/ui/lists/ListViewSuffix"/>
            </div>
          </$set>
        </$list>
      </div>
      
      ${addButtonWT}
    `;
                
    return finalWT;
  };
})();