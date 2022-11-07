import {CookieJar} from "../cookie";

const { objectContaining, assertions } = expect;
const url = 'http://www.example.com'

describe('Regression Tests', () => {
  it('should handle trailing semi-colons', async () => {
    const cookieJar = new CookieJar()
    await cookieJar.setCookie('broken_path=testme; path=/;', url)
    await cookieJar.setCookie('b=2; Path=/;;;;', url)
    const cookies = await cookieJar.getCookies(url)
    expect(cookies).toEqual([
      objectContaining({
        key: 'broken_path',
        value: 'testme',
        path: '/'
      }),
      objectContaining({
        key: 'b',
        value: '2',
        path: '/'
      })
    ])
  })

  it('should not throw exception on malformed URI (GH-32)', async () => {
    const malformedUri = `${url}/?test=100%`
    const cookieJar = new CookieJar()
    await cookieJar.setCookie('Test=Test', malformedUri)
    await expect(cookieJar.getCookieString(malformedUri)).resolves.toBe('Test=Test')
  })

  it('should allow setCookie (without options) callback works even if it is not instanceof Function (GH-158/GH-175)', () => {
    assertions(2)
    const cookieJar = new CookieJar()

    // @ts-ignore
    const callback = function(err, cookie) {
      expect(err).toBeNull()
      expect(cookie).toEqual(objectContaining({
        key: 'a',
        value: 'b'
      }))
    }

    Object.setPrototypeOf(callback, null)
    if (callback instanceof Function) {
      fail('clearing callback prototype chain failed')
    }

    cookieJar.setCookie('a=b', url, callback)
  })

  it('getCookies (without options) callback works even if it is not instanceof Function (GH-175)', async () => {
    assertions(2)
    const cookieJar = new CookieJar()

    // @ts-ignore
    const callback = function(err, cookie) {
      expect(err).toBeNull()
      expect(cookie).toEqual([
        objectContaining({
          key: 'a',
          value: 'b'
        })
      ])
    }

    Object.setPrototypeOf(callback, null)
    if (callback instanceof Function) {
      fail('clearing callback prototype chain failed')
    }

    await cookieJar.setCookie('a=b', url)
    cookieJar.getCookies(url, callback)
  })

  it.each([
    ["a=b; Domain=localhost", 'localhost'],
    ["a=b; Domain=localhost.local", 'local'],
    ["a=b; Domain=.localhost", 'localhost']
  ])('should raise an error if using a special use domain (GH-215) - %s', async (cookieString, publicSuffix) => {
    const cookieJar = new CookieJar();
    await expect(cookieJar.setCookie(
      cookieString,
      "http://localhost"
    )).rejects.toThrowError(`Cookie has domain set to the public suffix "${publicSuffix}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain:true, rejectPublicSuffixes: false}.`)
  })

  it('should allow setCookie with localhost and null domain (GH-215)', async () => {
    const cookieJar = new CookieJar();
    await expect(cookieJar.setCookie(
      "a=b; Domain=",
      "http://localhost"
    )).resolves.toEqual(objectContaining({
      key: 'a',
      value: 'b',
      domain: 'localhost'
    }))
  })


})
