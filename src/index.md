
## useReactive

Demo:

```tsx
import React from 'react';
import {useReactive} from '@jason-design/useReactive'
import { reactive } from '@vue/reactivity'
const state = reactive({
    count: 1
  })
export default () => {
  const { count } = useReactive(() => ({
    count: state.count
  }))
  return <div>
    <h1>{state.count}</h1>
    <button onClick={() => {
      state.count +=1
    }}>
    add
    </button>
  </div>
};
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
