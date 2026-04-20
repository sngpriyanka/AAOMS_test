// pages/ProductListing/ProductListing.jsx
import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FiGrid, FiList, FiSliders, FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './ProductListing.css';

// Product Data for all categories
const allProducts = {
  // =====================
  // MAIN MENU ITEMS
  // =====================
  
  // T-SHIRTS (Main Menu)
  'tshirts': {
    title: 'T-SHIRTS',
    subtitle: 'EXPRESS YOUR STYLE',
    heroImage: 'https://images.unsplash.com/photo-1770563182164-d4d5e90215d5?q=80',
    products: [
      {
        id: 1,
        name: 'BOLD HORIZONS: CLASSIC OVERSIZED T-SHIRT',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600',
        colors: ['black', 'white', 'navy', 'grey'],
        extraColors: 6,
      },
      {
        id: 2,
        name: 'WANDERLUST GRAPHIC T-SHIRT',
        price: 1099,
        image: 'https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?w=600',
        colors: ['black', 'white'],
      },
      {
        id: 3,
        name: 'MOUNTAIN EXPLORER T-SHIRT',
        price: 1199,
        image: 'https://plus.unsplash.com/premium_photo-1690349404224-53f94f20df8f?w=600',
        colors: ['green', 'black', 'grey'],
      },
      {
        id: 4,
        name: 'VINTAGE ADVENTURE T-SHIRT',
        price: 999,
        image: 'https://images.unsplash.com/photo-1521498542256-5aeb47ba2b36?w=600',
      },
      {
        id: 5,
        name: 'ESSENTIAL COTTON T-SHIRT',
        price: 799,
        image: 'https://images.unsplash.com/photo-1621951753015-740c699ab970?w=600',
      },
      {
        id: 6,
        name: 'PREMIUM SUPIMA T-SHIRT',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1627225925683-1da7021732ea?w=600',
        colors: ['white', 'black'],
      },
    ]
  },

  // BOUTIQUE PRODUCTS (Main Menu)
  'boutique-products': {
    title: 'BOUTIQUE PRODUCTS',
    subtitle: 'EXCLUSIVE HANDCRAFTED COLLECTION',
    heroImage: 'https://images.unsplash.com/photo-1570857502809-08184874388e?q=80',
    products: [
      {
        id: 1,
        name: 'HANDCRAFTED LEATHER JOURNAL',
        price: 1899,
        image: 'https://plus.unsplash.com/premium_photo-1682096060450-6ac06a3a0478?w=600',
        colors: ['brown', 'black'],
      },
      {
        id: 2,
        name: 'ARTISAN CANVAS TOTE BAG',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1601432093209-8af1fd74b054?w=600',
        colors: ['beige', 'navy', 'olive'],
      },
      {
        id: 3,
        name: 'VINTAGE BRASS COMPASS',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1763971922552-fa9cbe06db7a?w=600',
        colors: [],
      },
      {
        id: 4,
        name: 'HAND-STITCHED PASSPORT HOLDER',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1765269304156-7e4fff7e45ab?w=600',
        colors: ['brown', 'tan', 'black'],
      },
      {
        id: 5,
        name: 'WOODEN WATCH - WALNUT',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1772683530217-b2dfb462c483?w=600',
        colors: ['brown'],
      },
      {
        id: 6,
        name: 'HANDWOVEN COTTON SCARF',
        price: 999,
        image: 'https://images.unsplash.com/photo-1610048616025-11a3dcc9fd0b?w=600',
        colors: ['blue', 'red', 'green', 'grey'],
      },
    ]
  },

  // =====================
  // SHOP BY CATEGORY - TOP WEAR
  // =====================

  // PRINTED T-SHIRTS
  'printed-tshirts': {
    title: 'PRINTED T-SHIRTS',
    subtitle: 'EXPRESS YOUR STYLE WITH UNIQUE DESIGNS',
    heroImage: 'https://images.unsplash.com/photo-1574177367965-3e37ff611c48?w=600',
    products: [
      {
        id: 1,
        name: 'BOLD HORIZONS: CLASSIC OVERSIZED T-SHIRT',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1678951553950-90123af8b2eb?w=600',
        colors: ['black', 'white', 'navy', 'grey'],
        extraColors: 6,
      },
      {
        id: 2,
        name: 'WANDERLUST GRAPHIC T-SHIRT',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1625578388299-c1a45099ccba?w=600',
        colors: ['black', 'white'],
      },
      {
        id: 3,
        name: 'MOUNTAIN EXPLORER T-SHIRT',
        price: 1199,
        image: 'https://plus.unsplash.com/premium_photo-1770394054132-641dcf97d782?w=600',
        colors: ['green', 'black', 'grey'],
      },
      {
        id: 4,
        name: 'VINTAGE ADVENTURE T-SHIRT',
        price: 999,
        image: 'https://images.unsplash.com/photo-1684949552540-06a1447c3cff?w=600',
        colors: ['brown', 'black'],
      },
      {
        id: 5,
        name: 'NOMAD SPIRIT T-SHIRT',
        price: 1149,
        image: 'https://images.unsplash.com/photo-1685883518316-355533810d68?w=600',
        colors: ['black', 'white', 'grey'],
      },
      {
        id: 6,
        name: 'URBAN EXPLORER T-SHIRT',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1661693369027-03f3abd8d715?w=600',
        colors: ['navy', 'black'],
      },
    ]
  },

  // PLAIN T-SHIRTS
  'plain-tshirts': {
    title: 'PLAIN T-SHIRTS',
    subtitle: 'SIMPLE. CLEAN. ESSENTIAL.',
    heroImage: 'https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?w=600',
    products: [
      {
        id: 1,
        name: 'ESSENTIAL COTTON T-SHIRT',
        price: 799,
        image: 'https://images.unsplash.com/photo-1759572095329-1dcf9522762b?w=600',
        colors: ['white', 'black', 'grey', 'navy'],
        extraColors: 4,
      },
      {
        id: 2,
        name: 'PREMIUM SUPIMA T-SHIRT',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1618354691551-44de113f0164?w=600',
        colors: ['white', 'black'],
      },
      {
        id: 3,
        name: 'CLASSIC CREW NECK T-SHIRT',
        price: 699,
        image: 'https://plus.unsplash.com/premium_photo-1689565524694-88720c282271?w=600',
        colors: ['white', 'black', 'grey', 'navy', 'green'],
        extraColors: 3,
      },
      {
        id: 4,
        name: 'SLIM FIT ESSENTIAL T-SHIRT',
        price: 849,
        image: 'https://plus.unsplash.com/premium_photo-1770559428079-ac7bfb8eea78?w=600',
        colors: ['black', 'white', 'charcoal'],
      },
    ]
  },

  // PRINTED SWEAT-SHIRTS
  'printed-sweatshirts': {
    title: 'PRINTED SWEAT-SHIRTS',
    subtitle: 'COZY WITH CHARACTER',
    heroImage: 'https://images.unsplash.com/photo-1706007662540-6efa159381d3?w=600',
    products: [
      {
        id: 1,
        name: 'MOUNTAIN CALLING SWEATSHIRT',
        price: 2299,
        image: 'https://images.unsplash.com/photo-1767610966967-7c6da03579ea?w=600',
        colors: ['grey', 'black'],
      },
      {
        id: 2,
        name: 'ADVENTURE AWAITS SWEATSHIRT',
        price: 2199,
        image: 'https://images.unsplash.com/photo-1657130285329-70352efe9f09?w=600',
        colors: ['navy', 'grey', 'black'],
      },
      {
        id: 3,
        name: 'EXPLORE MORE SWEATSHIRT',
        price: 2099,
        image: 'https://images.unsplash.com/photo-1717672010655-e945fbb87e43?w=600',
        colors: ['olive', 'grey'],
      },
      {
        id: 4,
        name: 'WILD & FREE SWEATSHIRT',
        price: 2299,
        image: 'https://plus.unsplash.com/premium_photo-1727967192808-7024064aa628?q=80',
        colors: ['black', 'forest-green'],
      },
    ]
  },

  // PLAIN SWEAT-SHIRTS
  'plain-sweatshirts': {
    title: 'PLAIN SWEAT-SHIRTS',
    subtitle: 'MINIMAL. COMFORTABLE. VERSATILE.',
    heroImage: 'https://images.unsplash.com/photo-1710091913167-ad1d522f080a?w=600',
    products: [
      {
        id: 1,
        name: 'ESSENTIAL PLAIN SWEATSHIRT',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1633781935348-80f0b213179e?w=600',
        colors: ['black', 'grey', 'navy', 'green'],
      },
      {
        id: 2,
        name: 'CLASSIC CREWNECK SWEATSHIRT',
        price: 1899,
        image: 'https://images.unsplash.com/photo-1731570762889-ff7509212405?w=600',
        colors: ['grey', 'black', 'navy'],
      },
      {
        id: 3,
        name: 'RELAXED FIT SWEATSHIRT',
        price: 2099,
        image: 'https://images.unsplash.com/photo-1717241607355-67ac8d3eb7c6?w=600',
        colors: ['oatmeal', 'charcoal', 'forest'],
      },
      {
        id: 4,
        name: 'HEAVYWEIGHT SWEATSHIRT',
        price: 2299,
        image: 'https://plus.unsplash.com/premium_photo-1690034979146-59a98168f27e?w=600',
        colors: ['black', 'grey'],
      },
    ]
  },

  // HOODIES
  'hoodies': {
    title: 'HOODIES',
    subtitle: 'WARMTH MEETS STYLE',
    heroImage: 'https://images.unsplash.com/photo-1507348899121-a03dab81d98c?w=600',
    products: [
      {
        id: 1,
        name: 'CLASSIC TROOPER HOODIE',
        price: 2699,
        image: 'https://images.unsplash.com/photo-1618333845076-890b5baf8ffe?w=600',
        colors: ['black', 'grey', 'navy'],
      },
      {
        id: 2,
        name: 'EXPLORER ZIP-UP HOODIE',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1622567893612-a5345baa5c9a?w=600',
        colors: ['black', 'olive'],
      },
      {
        id: 3,
        name: 'OVERSIZED COMFORT HOODIE',
        price: 2799,
        image: 'https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=600',
        colors: ['grey', 'black', 'brown'],
      },
      {
        id: 4,
        name: 'PULLOVER GRAPHIC HOODIE',
        price: 2899,
        image: 'https://images.unsplash.com/photo-1526476148966-98bd039463ea?w=600',
        colors: ['black', 'navy'],
      },
      {
        id: 5,
        name: 'FLEECE LINED HOODIE',
        price: 3199,
        image: 'https://images.unsplash.com/photo-1635796244808-d93b6e26de62?w=600',
        colors: ['charcoal', 'black'],
      },
    ]
  },

  // =====================
  // SHOP BY CATEGORY - BOTTOM WEAR
  // =====================

  // HOPPERS
  'hoppers': {
    title: 'HOPPERS',
    subtitle: 'YOUR GO-TO PANTS FOR WHEREVER LIFE TAKES YOU',
    heroImage: 'https://plus.unsplash.com/premium_photo-1661880856815-1b83510006f0?w=600',
    products: [
      {
        id: 1,
        name: '9-POCKETS DENIM CARGO MAX HOPPERS',
        price: 2875,
        image: 'https://aaoms.com/cdn/shop/files/BTP0015-Olive-Knee-Patch-Male-Front.jpg?v=1753454832&width=900',
        colors: ['blue', 'black'],
      },
      {
        id: 2,
        name: 'AEGEAN BLUE AIRWAVE HOPPERS',
        price: 2475,
        image: 'https://m.media-amazon.com/images/I/71FDRjV0EyL._AC_UY1100_.jpg',
        colors: ['blue', 'black'],
      },
      {
        id: 3,
        name: 'JET BLACK AIRWAVE HOPPERS',
        price: 2475,
        image: 'https://thedancebible.com/cdn/shop/products/Men_Jogger_1_1_685078e4-4427-49fd-a0c6-fe7e003fef5c.jpg?v=1681586516',
        colors: ['black'],
      },
      {
        id: 4,
        name: 'CAPPUCCINO CREAM ACTIVE QUICK DRY HOPPERS',
        price: 1875,
        image: 'https://m.media-amazon.com/images/I/51lQLp0hMNL._AC_UY1100_.jpg',
        colors: ['cream', 'grey'],
        quickDry: true,
      },
      {
        id: 5,
        name: 'OLIVE GREEN ACTIVE QUICK DRY HOPPERS',
        price: 1875,
        image: 'https://brownliving.in/cdn/shop/files/mens-tribal-harem-dark-blue-fits-waist-sizes-28-to-36-inches-at01021nd-hope-house-of-pure-eco-9501121.png?v=1758365337&width=1200',
        colors: ['green'],
        quickDry: true,
      },
      {
        id: 6,
        name: 'DEEP OCEAN BLUE ACTIVE QUICK DRY HOPPERS',
        price: 1875,
        image: 'https://i.pinimg.com/736x/96/1e/e8/961ee8491a27c8a56868dab4e1cd0865.jpg',
        colors: ['blue'],
      },
    ]
  },

  // TRAVEL PANTS
  'travel-pants': {
    title: 'TRAVEL PANTS',
    subtitle: 'READY FOR ANY ADVENTURE',
    heroImage: 'https://plus.unsplash.com/premium_photo-1752682554327-af6f8ac78ab7?w=600',
    products: [
      {
        id: 1,
        name: 'TROOPERGO: ULTRA LIGHT TREKKING PANTS',
        price: 2475,
        image: 'https://images.unsplash.com/photo-1764726321742-6336144975bd?w=600',
        colors: ['green', 'blue', 'grey', 'black'],
      },
      {
        id: 2,
        name: 'TROOPERGO: AIRWAVE TREKKING PANTS',
        price: 2475,
        image: 'https://plus.unsplash.com/premium_photo-1756154061397-879a4bcd0b7b?w=600',
        colors: ['green', 'grey', 'black'],
      },
      {
        id: 3,
        name: 'CONVERTIBLE TRAVEL PANTS',
        price: 2799,
        image: 'https://images.unsplash.com/photo-1758565203908-199605f365e3?w=600',
        colors: ['khaki', 'grey', 'black'],
      },
      {
        id: 4,
        name: 'STRETCH COMFORT TRAVEL PANTS',
        price: 2299,
        image: 'https://www.clothingarts.com/cdn/shop/products/4x3_ctp_new.jpg?v=1762525472',
        colors: ['navy', 'black', 'charcoal'],
      },
    ]
  },

  // CARGO PANTS
  'cargo-pants': {
    title: 'CARGO PANTS',
    subtitle: 'UTILITY MEETS COMFORT',
    heroImage: 'https://plus.unsplash.com/premium_photo-1759821701691-5c75f066d24d?w=600',
    products: [
      {
        id: 1,
        name: 'TROOPERGO: 2-IN-1 UTILITY CARGO PANTS',
        price: 4250,
        image: 'https://images.unsplash.com/photo-1766575694179-e159f786d2e3?w=600',
        colors: ['green', 'black', 'grey', 'orange'],
        
      },
      {
        id: 2,
        name: 'DESERT TAN OVERSIZED POCKETS CARGO MAX HOPPERS',
        price: 2875,
        image: 'https://lachicpick.in/wp-content/uploads/2023/08/988-6.png',
        colors: ['tan'],
        
      },
      {
        id: 3,
        name: 'NAVY & BLACK TROOPERGO CARGO HOPPERS',
        price: 2475,
        image: 'https://i.ebayimg.com/images/g/36sAAOSwv8Vh3QNk/s-l1000.jpg',
        colors: ['navy', 'black'],
        
      },
      {
        id: 4,
        name: 'CARDEMOM GREEN & BLACK TROOPERGO CARGO HOPPERS',
        price: 2475,
        image: 'https://uk.brandymelville.com/cdn/shop/files/MH615-Z363SZ1990000-2_a9165952-a4ee-42e5-bd64-cc2e2c9efcff_1500x.jpg?v=1726261542',
        colors: ['green', 'black'],
        
      },
      {
        id: 5,
        name: 'CAPPUCCINO & COAL GREY TROOPERGO CARGO HOPPERS',
        price: 2475,
        image: 'https://spao.my/cdn/shop/files/SPTCF37C1149_FRONT_018a5e2e-4b89-4db4-93df-4d8024539b28.jpg?v=1752423220',
        colors: ['beige', 'grey'],
        
      },
      {
        id: 6,
        name: 'TACTICAL CARGO PANTS',
        price: 2699,
        image: 'https://static-01.daraz.com.np/p/5d06afeb8a4535cf7202f8bc933b3182.jpg',
        colors: ['black', 'olive', 'grey'],
      },
    ]
  },

  // CARGO SHORTS
  'cargo-shorts': {
    title: 'CARGO SHORTS',
    subtitle: 'SUMMER READY',
    heroImage: 'https://plus.unsplash.com/premium_photo-1770480360292-e89f938b2fe5?w=600',
    products: [
      {
        id: 1,
        name: 'TACTICAL CARGO SHORTS',
        price: 1875,
        image: 'https://images.unsplash.com/photo-1748565387500-849a7d3b4989?w=600',
        colors: ['khaki', 'black', 'olive'],
      },
      {
        id: 2,
        name: 'CLASSIC CARGO SHORTS',
        price: 1699,
        image: 'https://m.media-amazon.com/images/I/81lTvTXU5LL._AC_SL1500_.jpg',
        colors: ['navy', 'grey', 'beige'],
      },
      {
        id: 3,
        name: 'RIPSTOP CARGO SHORTS',
        price: 1799,
        image: 'https://lane201.com/cdn/shop/files/mocha-cargo-shorts-1157642484.jpg?v=1759305099&width=2048',
        colors: ['olive', 'black'],
      },
      {
        id: 4,
        name: 'STRETCH CARGO SHORTS',
        price: 1599,
        image: 'https://m.media-amazon.com/images/I/61KgoeE5+aL._AC_UY1000_.jpg',
        colors: ['charcoal', 'khaki', 'navy'],
      },
    ]
  },

  // =====================
  // CURATED PRODUCTS
  // =====================

  // APRON
  'apron': {
    title: 'APRON',
    subtitle: 'PROFESSIONAL GRADE APRONS FOR EVERY WORKSPACE',
    heroImage: 'https://png.pngtree.com/thumb_back/fh260/background/20240912/pngtree-doctor-holding-clipboard-in-hospital-corridor-medical-stock-photo-image_16150320.jpg',
    products: [
      {
        id: 1,
        name: 'CLASSIC CHEF APRON - BLACK',
        price: 1499,
        image: 'https://cpimg.tistatic.com/05476522/b/4/Hospital-Staff-Apron.jpg',
        colors: ['black'],
      },
      {
        id: 2,
        name: 'CLASSIC CHEF APRON - WHITE',
        price: 1499,
        image: 'https://5.imimg.com/data5/ANDROID/Default/2021/7/KA/HX/OO/107036322/img-20210722-wa0014-jpg-500x500.jpg',
        colors: ['white'],
      },
      {
        id: 3,
        name: 'CLASSIC CHEF APRON - NAVY',
        price: 1499,
        image: 'https://img500.exportersindia.com/product_images/bc-500/dir_169/5065292/hospital-aprons-1498916168-3099356.jpeg',
        colors: ['navy'],
      },
      {
        id: 4,
        name: 'BARISTA APRON - DENIM',
        price: 1799,
        image: 'https://www.retterworkwear.com/uploaded-files/category/images/thumbs/Nurse-Tops-thumbs-300X300.jpg',
        colors: ['blue', 'black'],
      },
      {
        id: 5,
        name: 'BARISTA APRON - CANVAS',
        price: 1699,
        image: 'https://cpimg.tistatic.com/05476521/s/4/Hospital-Staff-Synthetic-Apron.jpg',
        colors: ['beige', 'grey', 'black'],
      },
      {
        id: 6,
        name: 'UTILITY WORK APRON',
        price: 1999,
        image: 'https://4.imimg.com/data4/TS/AJ/MY-2676438/cotton-apron-500x500.jpg',
        colors: ['brown', 'black'],
      },
      {
        id: 7,
        name: 'LEATHER CRAFT APRON',
        price: 2999,
        image: 'https://cdn.dsmcdn.com/mnresize/420/620/ty1559/product/media/images/ty1556/prod/QC/20240919/00/d29d84c7-79c8-3705-b765-c9df12aa8e5b/1_org_zoom.jpg',
        colors: ['brown'],
      },
      {
        id: 8,
        name: 'BISTRO WAIST APRON',
        price: 899,
        image: 'https://i.pinimg.com/236x/98/36/8f/98368f228204487dfb6d14bc34f4e4c6.jpg',
        colors: ['black', 'white', 'grey'],
      },
      {
        id: 9,
        name: 'GARDEN APRON WITH POCKETS',
        price: 1299,
        image: 'https://omfabrics.com/images/Product/hospital-staff-uniform-500x500.jpg',
        colors: ['green', 'brown'],
      },
      {
        id: 10,
        name: 'PROFESSIONAL COOKING APRON',
        price: 1599,
        image: 'https://tiimg.tistatic.com/fp/1/006/387/hospital-staff-comfortable-apron-120.jpg',
        colors: ['black', 'grey', 'red'],
      },
    ]
  },

  // SCRUBS
  'scrubs': {
    title: 'SCRUBS',
    subtitle: 'COMFORTABLE MEDICAL SCRUBS FOR HEALTHCARE PROFESSIONALS',
    heroImage: '/images/categories/scrubs-hero.jpg',
    products: [
      {
        id: 1,
        name: 'CLASSIC V-NECK SCRUB TOP - CEIL BLUE',
        price: 1299,
        image: '/images/products/scrub-top-ceil.jpg',
        colors: ['blue'],
      },
      {
        id: 2,
        name: 'CLASSIC V-NECK SCRUB TOP - NAVY',
        price: 1299,
        image: '/images/products/scrub-top-navy.jpg',
        colors: ['navy'],
      },
      {
        id: 3,
        name: 'CLASSIC V-NECK SCRUB TOP - BLACK',
        price: 1299,
        image: '/images/products/scrub-top-black.jpg',
        colors: ['black'],
      },
      {
        id: 4,
        name: 'CLASSIC V-NECK SCRUB TOP - WINE',
        price: 1299,
        image: '/images/products/scrub-top-wine.jpg',
        colors: ['wine'],
      },
      {
        id: 5,
        name: 'CLASSIC V-NECK SCRUB TOP - HUNTER GREEN',
        price: 1299,
        image: '/images/products/scrub-top-green.jpg',
        colors: ['green'],
      },
      {
        id: 6,
        name: 'DRAWSTRING SCRUB PANTS - CEIL BLUE',
        price: 1199,
        image: '/images/products/scrub-pants-ceil.jpg',
        colors: ['blue'],
      },
      {
        id: 7,
        name: 'DRAWSTRING SCRUB PANTS - NAVY',
        price: 1199,
        image: '/images/products/scrub-pants-navy.jpg',
        colors: ['navy'],
      },
      {
        id: 8,
        name: 'DRAWSTRING SCRUB PANTS - BLACK',
        price: 1199,
        image: '/images/products/scrub-pants-black.jpg',
        colors: ['black'],
      },
      {
        id: 9,
        name: 'JOGGER SCRUB PANTS - NAVY',
        price: 1499,
        image: '/images/products/jogger-scrub-navy.jpg',
        colors: ['navy', 'black', 'grey'],
      },
      {
        id: 10,
        name: 'SCRUB SET - CEIL BLUE (TOP + PANTS)',
        price: 2299,
        image: '/images/products/scrub-set-ceil.jpg',
        colors: ['blue'],
      },
      {
        id: 11,
        name: 'SCRUB SET - NAVY (TOP + PANTS)',
        price: 2299,
        image: '/images/products/scrub-set-navy.jpg',
        colors: ['navy'],
      },
      {
        id: 12,
        name: 'SCRUB SET - BLACK (TOP + PANTS)',
        price: 2299,
        image: '/images/products/scrub-set-black.jpg',
        colors: ['black'],
      },
      {
        id: 13,
        name: 'LAB COAT - WHITE',
        price: 1999,
        image: '/images/products/lab-coat-white.jpg',
        colors: ['white'],
      },
      {
        id: 14,
        name: 'SCRUB CAP - PRINTED',
        price: 399,
        image: '/images/products/scrub-cap-printed.jpg',
        colors: ['blue', 'green', 'pink'],
      },
      {
        id: 15,
        name: 'SCRUB CAP - SOLID',
        price: 349,
        image: '/images/products/scrub-cap-solid.jpg',
        colors: ['navy', 'black', 'ceil', 'wine'],
      },
    ]
  },

  // =====================
  // ALL COLLECTIONS
  // =====================
  'all': {
    title: 'ALL COLLECTIONS',
    subtitle: 'EXPLORE EVERYTHING',
    heroImage: 'https://images.unsplash.com/photo-1563826830589-cd0946a9dc72?q=80',
    products: []
  }
};

// Populate 'all' with all unique products
const allProductsList = [];
const seenIds = new Set();
Object.keys(allProducts).forEach(key => {
  if (key !== 'all' && allProducts[key].products) {
    allProducts[key].products.forEach(product => {
      if (!seenIds.has(product.id)) {
        seenIds.add(product.id);
        allProductsList.push(product);
      }
    });
  }
});
allProducts['all'].products = allProductsList;

const ProductListing = () => {
  const { category } = useParams();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    color: 'all',
  });

  // Get search query from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';
  const isSearchMode = searchQuery.trim().length > 0;

  // Determine which category to show
  const getCategoryKey = () => {
    const path = location.pathname;
    
    // /search route - search across all products
    if (path.includes('/search')) {
      return 'all';
    }
    // /category/xxx routes
    if (path.includes('/category/')) {
      return category;
    }
    // /curated/xxx routes
    if (path.includes('/curated/')) {
      return category;
    }
    // /collections/xxx routes
    if (path.includes('/collections/')) {
      return category;
    }
    return category || 'all';
  };

  const categoryKey = getCategoryKey();
  const categoryData = allProducts[categoryKey] || allProducts['all'];

  // Filter and sort products
  const getFilteredProducts = () => {
    let products = [...categoryData.products];

    // Apply search filter - comprehensive matching
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().split(' ');
      products = products.filter(p => {
        const name = p.name.toLowerCase();
        const colorMatch = p.colors && p.colors.some(color => 
          query.some(q => color.toLowerCase().includes(q))
        );
        const nameMatch = query.some(q => name.includes(q));
        
        return nameMatch || colorMatch;
      });
    }

    /*// Apply availability filter
    if (filters.availability === 'in-stock') {
      products = products.filter(p => !p.soldOut);
    } else if (filters.availability === 'sold-out') {
      products = products.filter(p => p.soldOut);
    } */

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      products = products.filter(p => p.price >= min && p.price <= max);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="product-listing">
      <Navbar />

      {/* Hero Section */}
      <section className="product-listing__hero">
        {isSearchMode ? (
          <div className="product-listing__search-hero">
            <div className="product-listing__search-content">
              <h1 className="product-listing__search-title">SEARCH RESULTS</h1>
              <p className="product-listing__search-query">Searching for: <strong>"{searchQuery}"</strong></p>
              <p className="product-listing__search-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'} FOUND</p>
            </div>
          </div>
        ) : (
          <div className="product-listing__hero-image">
            <img 
              src={categoryData.heroImage || '/images/categories/default-hero.jpg'} 
              alt={categoryData.title} 
            />
            <div className="product-listing__hero-overlay">
              <h1 className="product-listing__hero-title">{categoryData.title}</h1>
              {categoryData.subtitle && (
                <p className="product-listing__hero-subtitle">{categoryData.subtitle}</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className={`product-listing__content ${isSearchMode ? 'product-listing__content--search' : ''}`}>
        {/* Header Bar */}
        <div className="product-listing__header">
          <div className="product-listing__count">
            {isSearchMode && (
              <span className="product-listing__search-badge">SEARCH</span>
            )}
            {filteredProducts.length} PRODUCT{filteredProducts.length !== 1 ? 'S' : ''}
          </div>
          <div className="product-listing__controls">
            <button
              className={`product-listing__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`product-listing__view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList size={18} />
            </button>
            <span className="product-listing__divider">|</span>
            <button
              className="product-listing__filter-btn"
              onClick={() => setShowFilters(true)}
            >
              <FiSliders size={16} />
              FILTER & SORT
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`product-listing__grid ${viewMode}`}>
            {filteredProducts.map((product) => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id} 
                className="product-card"
              >
                <div className="product-card__image-wrapper">
                <img src={product.image} alt={product.name} />
                {/* {product.soldOut && (
                  <span className="product-card__badge product-card__badge--sold-out">
                    SOLD OUT
                  </span>
                )} */}
                {product.quickDry && (
                  <span className="product-card__badge product-card__badge--quick-dry">
                    <span>QUICK</span>
                    <span>DRY</span>
                  </span>
                )}
                {/* {product.originalPrice && (
                  <span className="product-card__badge product-card__badge--sale">
                    SALE
                  </span>
                )} */}
              </div>
              <div className="product-card__info">
                <h3 className="product-card__name">{product.name}</h3>
                {/* <div className="product-card__price">
                  {product.originalPrice && (
                    <span className="product-card__price--original">
                      Rs.{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className={product.originalPrice ? 'product-card__price--sale' : ''}>
                    Rs.{product.price.toLocaleString()}
                  </span>
                </div> */}
                <div className="product-card__price">
  <span>
    Rs.{product.price.toLocaleString()}
  </span>
</div>
              </div>
            </Link>
          ))}
          </div>
        ) : (
          <div className="product-listing__empty">
            <FiSearch size={60} style={{ marginBottom: '20px', color: '#c9a227', opacity: 0.6 }} />
            <p>
              {searchQuery 
                ? `No products found for "${searchQuery}"` 
                : 'No products found matching your criteria.'}
            </p>
            {searchQuery && (
              <p className="product-listing__empty-subtitle">
                Try a different search term or browse our collections
              </p>
            )}
            <button 
              className="product-listing__empty-btn"
              onClick={() => window.location.href = '/'}
            >
              BROWSE ALL PRODUCTS
            </button>
          </div>
        )}

        {/* Empty State - Old Code (can be removed) - This is now replaced above */}
        {/* {filteredProducts.length === 0 && (
          <div className="product-listing__empty">
            <p>No products found matching your criteria.</p>
            <button onClick={() => setFilters({ priceRange: 'all', color: 'all', availability: 'all' })}>
              Clear Filters
            </button>
          </div>
        )} */}
      </section>

      {/* Filter Sidebar */}
      <div className={`filter-sidebar ${showFilters ? 'filter-sidebar--open' : ''}`}>
        <div className="filter-sidebar__backdrop" onClick={() => setShowFilters(false)}></div>
        <div className="filter-sidebar__content">
          <div className="filter-sidebar__header">
            <h3>FILTER & SORT</h3>
            <button onClick={() => setShowFilters(false)}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="filter-sidebar__body">
            <div className="filter-group">
              <h4>SORT BY</h4>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>PRICE RANGE</h4>
              <select 
                value={filters.priceRange} 
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              >
                <option value="all">All Prices</option>
                <option value="0-1000">Under Rs.1,000</option>
                <option value="1000-2000">Rs.1,000 - Rs.2,000</option>
                <option value="2000-3000">Rs.2,000 - Rs.3,000</option>
                <option value="3000-5000">Rs.3,000 - Rs.5,000</option>
                <option value="5000-100000">Above Rs.5,000</option>
              </select>
            </div>

           {/* <div className="filter-group">
              <h4>AVAILABILITY</h4>
              <select 
                value={filters.availability} 
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
              >
                <option value="all">All</option>
                <option value="in-stock">In Stock</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div> */}
          </div> 

          <div className="filter-sidebar__footer">
            <button 
              className="filter-sidebar__clear"
              onClick={() => {
                setFilters({ priceRange: 'all', color: 'all', availability: 'all' });
                setSortBy('featured');
              }}
            >
              Clear All
            </button>
            <button 
              className="filter-sidebar__apply"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductListing;