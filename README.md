# table

Vanilla JS data table component.

![sc1](./img/sc1.png)

## Usage

`npm i @samhuk/table`

Basic usage (default column options, no custom configuration, etc.):

```typescript
import { createTable } from '@samhuk/table'

const element = document.createElement('div')

const table = createTable({
  columnOrdering: ['A', 'B', 'C'],
  initialData: [
    { a: 1, b: 2, c: 3 },
    { a: 4, b: 5, c: 6 }
    { a: 7, b: 8, c: 9 }
  ]
})
```

## Development Deployment

One must have node and npm installed. Get node from [nodejs.org](https://nodejs.org/en/download/).

Run `npm i`

Run `npm start`

Try navigating to localhost:4001.
