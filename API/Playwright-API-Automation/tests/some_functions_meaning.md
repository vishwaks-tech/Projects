What you’re seeing is **exactly how the JavaScript `URL` class works**, and once you understand how it builds query strings, the `?limit=10&offset=0` part becomes obvious.

Let’s walk through it step by step using your exact code.

---

## ⭐ 1. Your `queryParams` object

```ts
{ limit: 10, offset: 0 }
```

This is a plain JavaScript object.

---

## ⭐ 2. You loop through it:

```ts
for (const [key, value] of Object.entries(this.queryParams)) {
    url.searchParams.append(key, value)
}
```

Break this down:

### `Object.entries(this.queryParams)`  
Turns your object into an array of key/value pairs:

```
[
  ["limit", 10],
  ["offset", 0]
]
```

### Loop 1  
`key = "limit"`  
`value = 10`

→ `url.searchParams.append("limit", 10)`

### Loop 2  
`key = "offset"`  
`value = 0`

→ `url.searchParams.append("offset", 0)`

---

## ⭐ 3. What does `searchParams.append()` do?

It modifies the internal query string of the URL object.

So after both appends, the URL object contains:

```
?limit=10&offset=0
```

This is **automatically generated** by the URL class.

---

## ⭐ 4. Why does it add `?` and `&` automatically?

Because the `URL` class is designed to build valid URLs.

You never manually write:

```
?limit=10&offset=0
```

Instead, you tell the URL object:

> “Add a query parameter named limit with value 10.”

And it decides:

- If this is the **first** query param → prefix with `?`
- If there are **more** → prefix with `&`

So:

### First append  
```
?limit=10
```

### Second append  
```
?limit=10&offset=0
```

---

## ⭐ 5. That’s why your final output is:

```
https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0
```

You never typed `?` or `&`.  
The URL class did it for you.

---

## ⭐ 6. Visual breakdown

Let’s visualize how the URL object evolves:

### Step 1 — Base URL + Path

```
https://conduit-api.bondaracademy.com/api/articles
```

### Step 2 — Append `limit=10`

```
https://conduit-api.bondaracademy.com/api/articles?limit=10
```

### Step 3 — Append `offset=0`

```
https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0
```

---

## ⭐ 7. Why does this feel magical?

Because the `URL` class:

- parses URLs
- validates them
- manages query strings
- handles encoding
- handles ordering
- handles separators (`?` and `&`)
- prevents malformed URLs

This is why it’s better than manually concatenating strings.

---

## ⭐ Final clarity

### ✔ You give the URL object **key/value pairs**  
### ✔ It automatically builds a valid query string  
### ✔ It decides where to put `?` and `&`  
### ✔ You never manually write the query syntax  

This is exactly how the `URL` class is supposed to work.