import {priceDisplay} from '../main.mjs'


describe('price-display',()=>{
    test('展示价格0',()=>{
        expect(priceDisplay(0)).toBe(0)
    })
    test('展示价格100',()=>{
        expect(priceDisplay(100)).toBe(100)
    })
    test('2展示价格100',()=>{
        expect(priceDisplay(300)).toBe(100)
    })
})
