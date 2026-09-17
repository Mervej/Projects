class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(capaity) {
    this.capaity = capaity;
    this.map = new Map();

    // dummy head/tail to simplify edge cases
    this.head = new Node(null, null);
    this.tail = new Node(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;

    this.map.delete(node.key);
    console.log(this.map);
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;

    const node = this.map.get(key);

    this._removeNode(node);
    this._addToFront(node);

    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._removeNode(node);
      this._addToFront(node);
      return;
    }

    if (this.map.size >= this.capaity) {
      const lru = this.tail.prev;
      this._removeNode(lru);
    }

    let node = new Node(key, value);
    this.map.set(key, node);
    this._addToFront(node);
  }

  has(key) {
    return this.map.has(key);
  }
}

// Usage
const cache = new LRUCache(3);
cache.put("a", 1);
cache.put("b", 2);
cache.put("c", 3);
cache.get("a"); // touches 'a', now most recent
cache.put("d", 4); // evicts 'b' (least recently used)
console.log(cache.has("b")); // false
