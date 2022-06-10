let editorState = {
    curLine: 0, // current line with cursor
    maxLine: 0, // the largest drawn line
}

// support functions 
 function defaultNewLine(curLine) {
    let line = document.createElement('div');
    line.id = `line-${curLine}`;
    line.number = curLine; // custome attribute
    line.className = 'editor-line';
    line.contentEditable = true;
    line.addEventListener('keydown', (ev) => {
        if (keydownHandler[ev.key] != undefined) {
            keydownHandler[ev.key](ev, editorState); // pass event and editor state
        } else {
            
        }
        keydownHandler.after(ev, editorState);
    });
    line.addEventListener('click', lineClick);
    return line;
}
function defaultNewLineNum(curline) {
    let num = document.createElement('span');
    num.id = `line-num-${curline}`;
    num.innerHTML = curline + '<br>';
    return num;
}
/**
 * Get a specific line by its number
 * @param {Number} num The line number to get the element, use `editorState.curline` if empty
 * @returns {HTMLDivElement} The <div> element of the line in the editor
 */
function getLine(num) {
    return document.getElementById(`line-${num || editorState.curLine}`)
}
function textWidth(text, fontProp) {
    var tag = document.createElement('div')
    tag.style.position = 'absolute'
    tag.style.left = '-99in'
    tag.style.whiteSpace = 'nowrap'
    tag.style.font = fontProp
    tag.innerHTML = text
    document.body.appendChild(tag)
    var result = tag.clientWidth
    document.body.removeChild(tag)
    return result;
}

// Functional functions
const keydownHandler = {
    any: (ev, ed) => {
        // any unhandel event
    },
    Enter: (ev, ed) => {
        ev.preventDefault(); // to prevent auto newline character
        if (ed.curLine == ed.maxLine) {
            // if last line
            ed.curLine++; ed.maxLine++;
            // ev.target.innerText = ev.target.innerText.split('\n')[0];
            // create line number
            document.getElementById('line-numbers').appendChild(defaultNewLineNum(ed.curLine))
            // create new line
            let line = defaultNewLine(ed.curLine);
            document.getElementById('text-area').appendChild(line);
            line.focus();
        } else {
            // if in the middle
            ed.curLine++; ed.maxLine++;
            let line = defaultNewLine(ed.curLine), 
                num = defaultNewLineNum(ed.curLine),
                txa = document.getElementById('text-area'),
                lna = document.getElementById('line-numbers');
            // re-generate the id with the proper number index
            txa.insertBefore(line, document.getElementById(`line-${ed.curLine}`));
            lna.insertBefore(num, document.getElementById(`line-num-${ed.curLine}`));
            for (let l = ed.curLine; l < txa.children.length; l++) {
                txa.children[l].number = l + 1;
                txa.children[l].id = `line-${l + 1}`;
                lna.children[l].innerHTML = (l + 1) + '<br>';
                lna.children[l].id = `line-num-${l + 1}`;
            }
            line.focus();
        }
        document.getElementById('editor').style.gridTemplateColumns = `${ed.maxLine.toString().length}rem 99fr`; // regenerate width
    },
    ArrowDown: (ev, ed) => {
        ev.preventDefault()
        ed.curLine++; getLine().focus();
    },
    ArrowUp: (ev, ed) => {
        ev.preventDefault()
        ed.curLine--; getLine().focus();
    },
    after: (ev, ed) => {
        // call this handler for cleanup jobs
        
    },
}
/**
 * Function to invoke when there is mouse click on a line
 * @param {MouseEvent} ev Mouse event
 */
function lineClick(ev) {
    let ed = editorState;
    ed.curLine = ev.target.number;
}

// init
keydownHandler.Enter({preventDefault: () => {}}, editorState); // initialize the first line, using stupid trick