<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tough-cookie](./tough-cookie.md) &gt; [GetCookiesOptions](./tough-cookie.getcookiesoptions.md) &gt; [expire](./tough-cookie.getcookiesoptions.expire.md)

## GetCookiesOptions.expire property

Perform `expiry-time` checking of cookies and asynchronously remove expired cookies from the store.

**Signature:**

```typescript
expire?: boolean | undefined;
```

## Remarks

- Using `false` returns expired cookies and does not remove them from the store which is potentially useful for replaying `Set-Cookie` headers.

Defaults to `true` if not provided.
