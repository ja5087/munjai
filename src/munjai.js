/* structure of the React Components:

MainPage
=frontPage
--HeaderBar
---HeaderItem
--ResolutionEditor
--TutorialsList
=tutorialPage <= tutorialsData
--TutorialPage


start by building the structure then refactoring to make it big
*/
var React = require("react");
var ReactDOM = require('react-dom');
var Remarkable = require('remarkable'); //used for Markdown

import {Editor, EditorState, SelectionState, Modifier} from 'draft-js'; 

class ResolutionEditor extends React.Component { //ES6 Syntax for new class
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()}; //pass empty editor state
        this.onChange = (editorState) => this.setState({editorState}); //fancy arrow function notation that passes the editorState to setState. SUPER CONCISE!
    }
    componentDidMount() {
        this.editor.focus(); //set the editor DOM to focus (from the ref)
    }
    handleButtonClick(e) {
        if(e.target.id=="boldWord") //if its the button
        {
            const {editorState} = this.state; //now editorState refers to this.state.editorState
            const currentSelection = this.state.editorState.getSelection();
            //console.dir(currentSelection);
            //get the text associated with the selected key
            /*
            Algorithm:
                Break down into  EditorState->ContentState->ContentBlock then generate new ContentState by using Modifier to applyInlineStyle BOLD and generate new EditorState to set as this.state
            */
            const currentContentState = editorState.getCurrentContent();
            const currentContentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey());
            var anchorKey = currentSelection.getStartKey();
            var selectionState = SelectionState.createEmpty(anchorKey);
            var firstWordEndOffset = TextHelper.returnWordEndOffset(currentContentBlock.getText(),0);
            var firstWordSelected = selectionState.merge( {
                focusKey: anchorKey,
                focusOffset: firstWordEndOffset,
            });
            const boldContentState = TextHelper.applyMultipleInlineStyles(
                editorState.getCurrentContent(),
                firstWordSelected,
                ['BOLD', 'ITALIC', 'UNDERLINE']
            );
            
            const newEditorState = EditorState.createWithContent(
                boldContentState
            );
            if(newEditorState)
            {
            this.setState({editorState: newEditorState});
            }
        }
    }
    render() {
        const {editorState} = this.state; //sets a const editorState to this.state.editorState 
        return (
            //we pass a ref callback in editor to set this.editor to the Editor DOM (to put focus on it)
        <div className="resolutionEditor">
        <h1> SUPER MODERN TEXT EDITOR </h1>
        <button type="button" id="boldWord" onClick={this.handleButtonClick.bind(this)}> Click here to bold first word of the selected line. </button>
        <p>Enter some text below! The textbox scales with size each line</p>
        <div className="resolutionTextInput">
        <Editor editorState={editorState} onChange={this.onChange} ref={(c) => this.editor = c}/> 
        </div>
        </div> //const EditorState object. every change creates new EditorState
        );
    }
}

var TextHelper = (function() { //module to help me manipulate strings
    var pub = {};
    pub.returnWordEndOffset = (function(string, wordIndex) {
        var i, currentOffset = -1;
        for(i = 0; i < wordIndex+1; i++)
        {
           currentOffset = string.indexOf(' ', currentOffset); //O(n) word search algorithm to find space order
        }
        return currentOffset;    
    });
    pub.applyMultipleInlineStyles = (function(contentState, selectionState, stylesArray) //helper method to apply multiple styles specified by an array
    {
        var i, newContentState = contentState;
        for(i=0;i<stylesArray.length;i++)
        {
            newContentState = Modifier.applyInlineStyle(
                newContentState,
                selectionState,
                stylesArray[i]
            );
        }
        return newContentState;
    });
    //TODO: ContentBlock level formatting for MUN Style Clauses
    return pub;
})();
    



var MainPage = React.createClass({

    getInitialState: function () {
        return {
            mode: "frontPage", //initially set to frontPage
            tutorialID: 1
        };
    },

    changePage: function (e) {
        if (e.target.id == 0) {
            this.setState({
                mode: "frontPage",
                tutorialID: 0,
            })
        } else {
            this.setState({
                mode: "tutorialPage", //set to tutorialPage if frontPage isnt met.
                tutorialID: e.target.id //set it to correct ID as specified in the tutorialsData
            })
        }
    },

    render: function () {
        //console.log(this.state.id);
        //console.log(this.state.mode);
        if (this.state.mode == "frontPage") {
            var divStyleLeft = {
                width: '50%',
                float: 'right',
                display: 'inline-block'
            };
            var divStyleRight =
                {
                    width: '50%',
                    float: 'left',
                    display: 'inline-block'
                };
            return ( //pass the changePage callback to HeaderBar plz
                <div className="mainPage">
                    <HeaderBar changePageHandler={this.changePage} />
                    <div style={divStyleLeft}>
                        <TutorialsList />
                    </div>
                    <div style={divStyleRight}>
                        <Resolution />
                    </div>
                </div>
            );
        } else if (this.state.mode == "tutorialPage") {
            return (
                <div className="mainPage">
                    <HeaderBar changePageHandler={this.changePage} />
                    <TutorialPage tutorialID={this.state.tutorialID}/>
                </div>
            );
        }
    }
});

var TutorialPage = React.createClass({
    render: function () {
        //search tutorialsData for the correct src corresponding with id
        var name, srcURL = "";
        var i;
        for (i = 0; i < tutorialsData.length; i++) {
            if (tutorialsData[i].id == this.props.tutorialID) {
                srcURL = tutorialsData[i].src;
                name = tutorialsData[i].name;
            }
        }

        return (
            <div className="tutorialPage">
                <h1>{name}</h1>
                <iframe width="100%" height="75%" src={srcURL} frameBorder="0" allowFullScreen></iframe>
            </div>
        )
    }
})

var tutorialsData = [ //store tutorials data as flat json
    {
        name: "Tutorial 1: two digit additon",
        src: "https://www.youtube.com/embed/OOcclZ8ucrU",
        id: 1
    },
    {
        name: "Tutorial 2: how not to run a country",
        src: "https://www.youtube.com/embed/FRlI2SQ0Ueg",
        id: 2
    }
]

var TutorialsList = React.createClass({

    render: function () {
        var tutorials = tutorialsData.map(function (data) {
            return (
                <Tutorial src={data.src} key={data.id} />
            );
        });

        return (
            <div className="tutorialsList" >
                <h1> Tutorials </h1>
                {tutorials}
            </div>
        )
    }
});

var HeaderBar = React.createClass({
    passClickEvent: function (e) {
        this.props.changePageHandler(e); //passed up the callback chain
    },
    render: function () {
        var itemsList = [{
            name: "Main Page",
            id: 0
        }];

        itemsList = itemsList.concat(tutorialsData); //build items list

        // console.dir(itemsList);

        var headerItemsList = itemsList.map(function (data) {
            return (
                <HeaderItem name={data.name} id={data.id} key={data.id} onClickEvent={this.passClickEvent}/>
            );
        }, this); //we also pass this to preserve the context and allow this.passClickEvent to go through properly
        return (
            <div className="headerBar">
                {headerItemsList}
            </div>
        )
    }
})

var HeaderItem = React.createClass({
    handleClickEvent: function (e) {
        this.props.onClickEvent(e); //pass e up the callback chain to handle Click event
    },
    render: function () {
        return (
            <div className="headerItem" onClick={this.handleClickEvent} id={this.props.id}>
                {this.props.name}
            </div>
        )
    }
})



var Tutorial = React.createClass({
    //props passed down:
    //embed src
    render: function () {
        return (
            <div className="tutorial">
                <iframe width="100%" height="100%" src={this.props.src} frameBorder="0" allowFullScreen></iframe>
            </div>
        )
    }

})

var Resolution = React.createClass({
    //holds the entire Resolution
    getInitialState: function () {
        return {
            data: [
                {
                    "id": 1,
                    "text": "designates un to serve"
                },
                {
                    "id": 2,
                    "text": "recognizes need to serve"
                },
                {
                    "id": 3,
                    "text": "discriminates based on gender"
                },

            ]
        };
    },

    componentDidMount: function () {
        return {
            data: []        //return the initial state as zero data
        }
    },

    render: function () {
        return (
            <div className="resolution">
                <ResolutionEditor />
                <ClausesNode data={this.state.data} />
            </div>
        )
    }

})

var ClausesNode = React.createClass({
    //nodes all the classes

    render: function () {
        var clausesList = this.props.data.map(function (clause) {
            //maps each clause to a proper div and listtag
            //dont forget to actually return from the function
            return (
                <li key={clause.id}>
                    <Clause text={clause.text} id={clause.id} key={clause.id}/>
                </li>
            );
        });

        return (
            <div className="clausesNode">
                <h1> Legacy Text Editor </h1>
                Type in some text here and watch it be automatically formatted!
                <ol>
                    {clausesList}
                </ol>
            </div>
        )
    }
});

var Clause = React.createClass({
    //a clause class containing the following states:
    // text, id
    markDown: function (text) {
        var md = new Remarkable();
        text = text.trim();
        if (text.indexOf(' ') > 0) {
            text = "__***"
                + text.substring(0, 1).toUpperCase()
                + text.substring(1, text.indexOf(' '))
                + "***__"
                + text.substring(text.indexOf(' '))
                + ',';
        }
        var markUpText = md.renderInline(text);
        return { __html: markUpText };
    },
    getInitialState: function () {
        return (
            {
                "text": this.props.text,
                "id": this.props.id,
            }
        )
    },
    handleClick: function (e) {
        e.preventDefault(); //prevent default behavior
        //e.target.style.display = "none";
        //TODO: Find a way to alternate form input and text to create impression
        //alert(e.target);
        /*var newText = prompt("Please enter new clause", "bomb isis"); 
        if(newText != null) {
            this.setState( //set state again
                {
                    "text" : newText
                }
            )
        }
        */
    },

    handleChangeEvent: function (e) {
        this.setState({ text: e.target.value })
    },

    render: function () {
        var idString = "clause_" + this.state.id;
        return (

            <div className="clause" onClick={this.handleClick} id={idString}>

                <div className="clauseText" dangerouslySetInnerHTML={this.markDown(this.state.text) } />
                <ClauseForm text={this.state.text} onChange={this.handleChangeEvent} />
            </div>
        )
    }
});

var ClauseForm = React.createClass({

    getInitialState: function () {
        return { "formText": "" }
    },

    handleFormTextChange: function (e) {
        e.preventDefault();
        this.setState({ formText: e.target.value })
    },

    handleChangeEvent: function (e) {
        this.props.onChange(e); //pass e back to the onChange callback in properties.
    },

    render: function () {
        return (

            <form className="clauseForm" onChange={this.handleChangeEvent}>
                <input
                    type="text"
                    placeholder={this.props.text}
                    value={this.state.formText}
                    onChange={this.handleFormTextChange}
                    />
            </form>


        )
    }
});



ReactDOM.render(
    <MainPage />,
    document.getElementById('content')
);

