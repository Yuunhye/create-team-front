class Node {
    constructor(data) {
      this.data = data;
      this.next = null;
      this.prev = null;
    }
  }
  
  class Deque {
    constructor() {
      this.head = null;
      this.tail = null;
    }
  
    append(data) {
      const newNode = new Node(data);
      if (this.head === null) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }
  
    appendleft(data) {
      const newNode = new Node(data);
      if (this.head === null) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
      }
    }
  
    popleft() {
      if (this.head === null) return null;
      const data = this.head.data;
      this.head = this.head.next;
      if (this.head !== null) this.head.prev = null;
      else this.tail = null;
      return data;
    }
  
    pop() {
      if (this.tail === null) return null;
      const data = this.tail.data;
      this.tail = this.tail.prev;
      if (this.tail !== null) this.tail.next = null;
      else this.head = null;
      return data;
    }

    peekLast(){
        if (this.tail == null) return null;
        else return this.tail.data;
    }

  }

  export default Deque;

  