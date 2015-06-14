var _uid = 0;
function makeId() {
  _uid = _uid + 1;
  return _uid;
}

function addToVis(from, to, nodes, edges, level, height) {
  if (to) {
    edges.push({
      id: makeId(),
      from: from.id,
      to: to.id});
    to.addToVis(nodes, edges, level + 1, height);
  }
}

function RadixTree(size, rootNode) {
  this.id = makeId();
  this.size = size;
  this.rootNode = rootNode;
}

function Node(left, right) {
  this.id = makeId();
  this.left = left;
  this.right = right;
  this.height = 1 + Math.max(left.height, right.height);
  this.size = 1 + left.size + right.size;
}
Node.prototype = _.assign(Node.prototype, {
  addToVis(nodes, edges, level, height) {
    nodes.push({id: this.id, label: '', level: height - this.height + 1});
    addToVis(this, this.left, nodes, edges, level, height);
    addToVis(this, this.right, nodes, edges, level, height);
  },
  push(node, bits) {
    var room = (1 << this.height) - this.size - 1;
    if (room <= 0) {
      return new Node(this, node);
    } else {
      while (bits.size >= this.height) {
        bits = bits.pop();
      }
      return bits.first()
        ? new Node(this.left, this.right.push(node, bits.shift()))
        : new Node(this.left.push(node, bits.shift()), this.right);
    }
  },
  toString() {
    return `new Node(${this.left}, ${this.right})`;
  }
});

function Leaf(value) {
  this.id = makeId();
  this.value = value;
  this.height = 1;
  this.size = 1;
}
Leaf.prototype = _.assign(Leaf.prototype, {
  addToVis(nodes, edges, level, height) {
    nodes.push({
      id: this.id,
      label: JSON.stringify(this.value),
      level: height - this.height + 1});
  },
  push(node, bits) {
    return new Node(this, node);
  },
  toString() {
    return `new Leaf(${this.value})`;
  }
});

RadixTree.of = function () {
  function buildRoot(values, start, end) {
    var d = end - start;
    if (d === 0) {
      return null;
    } else if (d === 1) {
      return new Leaf(values[start]);
    } else {
      var mid = end - Math.floor(d / 2);
      return new Node(
        buildRoot(values, start, mid),
        buildRoot(values, mid, end));
    }
  }
  return new RadixTree(arguments.length, buildRoot(arguments, 0, arguments.length));
}

RadixTree.prototype = _.assign(RadixTree.prototype, {
  toString() {
    return `new RadixTree(${this.size}, ${this.rootNode})`;
  },
  toVis() {
    var level = 0;
    var nodes = [{id: this.id, label: 'size: ' + this.size, level}];
    var edges = [];
    var {rootNode} = this;
    addToVis(this, rootNode, nodes, edges, level, rootNode ? rootNode.height : 0);
    return {nodes, edges};
  },
  push(v) {
    var leaf = new Leaf(v);
    if (this.size === 0) {
      return new RadixTree(1, leaf);
    }
    var bits = Immutable.Stack();
    for (var i = this.size; i > 0; i = i >> 1) {
      bits = bits.unshift(i & 1);
    }
    var height = this.rootNode ? this.rootNode.height : 0;
    return new RadixTree(this.size + 1, this.rootNode.push(leaf, bits));
  }
});

var TreeDemo = React.createClass({
  getInitialState() {
    return {trees: Immutable.List.of(RadixTree.of())};
  },
  addNode() {
    var {trees} = this.state;
    var tree = trees.last();
    this.setState({trees: trees.push(tree.push(tree.size))});
  },
  reconcile(prevState) {
    if (this.network) {
      this.network.destroy();
    }
    var {trees} = this.state;
    var prevNodes = Immutable.Set();
    if (trees.size > 1) {
      var {nodes} = trees.get(-2).toVis();
      prevNodes = Immutable.Set(_.pluck(nodes, 'id'));
    }
    var {nodes, edges} = trees.last().toVis();
    nodes.forEach((node) => {
      if (prevNodes.has(node.id)) {
        node.group = 'shared';
      } else {
        node.group = 'added';
      }
    });
    var d = document.createElement('div');
    this.getDOMNode().appendChild(d);
    this.network = new vis.Network(d,
      {edges: edges, nodes: nodes},
      {
        height: '550px',
        hierarchicalLayout: {
          layout: 'direction'
        },
        nodes: {
          fontSize: 24
        },
        groups: {
          added: {
            color: {background: '#00ff00'}
          },
          shared: {
            color: {background: '#97C2FC'}
          },
          garbage: {
            color: {background: '#CCCCCC'}
          }
        },
        edges: {
          style: 'arrow'
        },
        smoothCurves: false
      });
  },
  handleClick(e) {
    e.preventDefault();
    if (e.shiftKey) {
      var {trees} = this.state;
      if (trees.size > 1) {
        trees = trees.pop();
      }
      this.setState({trees});
    } else {
      this.addNode();
    }
  },
  componentDidMount() {
    this.getDOMNode().addEventListener('click', this.handleClick);
    this.network = null;
    this.reconcile();
  },
  componentWillUnmount() {
    this.network.destroy();
    this.network = null;
  },
  componentDidUpdate(prevProps, prevState) {
    this.reconcile();
    this.network.redraw();
  },
  render() {
    return <div/>;
  }
});

function slideReact(el, target) {
  var d = document.createElement('div');
  target.appendChild(d);
  d.classList.add('react-slide');
  var r = React.render(el, d);
  addUnloadCallback(() => {
    React.unmountComponentAtNode(d);
    target.removeChild(d);
  });
  return r;
}

var _unload = [];
function addUnloadCallback(f) {
  _unload.push(f);
}

var slidecode = {
  'tree-demo': function (target) {
    window._treeDemo = slideReact(<TreeDemo/>, target);
  }
};

function checkSlide(event) {
  while (_unload.length > 0) {
    _unload.pop()();
  }
  var currentSlide = event.currentSlide;
  var f = slidecode[currentSlide.id];
  if (f !== undefined) {
    f(currentSlide);
  }
}

Reveal.addEventListener('slidechanged', checkSlide);
if (Reveal.isReady()) {
  checkSlide({currentSlide: Reveal.getCurrentSlide()});
} else {
  Reveal.addEventListener('ready', checkSlide);
}
