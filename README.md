# example-erasure-coding-ts

```shell
>> ts-node main.ts
origin: Hello World
origin to buffer:  <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
bufferToShards(5 + 2) [
  Uint8Array(4) [ 72, 101, 108, 108 ],
  Uint8Array(4) [ 111, 32, 87, 111 ],
  Uint8Array(4) [ 114, 108, 100, 0 ],
  Uint8Array(4) [ 85, 41, 95, 3 ],
  Uint8Array(4) [ 241, 65, 153, 1 ]
]
corrupted shards:  [
  Uint8Array(0) [],
  Uint8Array(4) [ 111, 32, 87, 111 ],
  Uint8Array(4) [ 114, 108, 100, 0 ],
  Uint8Array(4) [ 85, 41, 95, 3 ],
  Uint8Array(0) []
]
restore buffer:  <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 00>
restored:  Hello World
erasure:  true
```
