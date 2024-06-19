"use server"

import { IProduct } from '@/model';



 export const products = async() =>{
  const response = await fetch("http://localhost:8080/api/product/getAllProduct");
  if(response.ok)
    {
      const data= await response.json()
      console.log(data)
    }
 }
//[
//   {
//     name: 'Nhà Giả Kim',
//     description:
//       'Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người. ',
//     price: 100000,
//     promotionalPrice: 90000,
//     quantity: 23,
//     rating: {
//       rate: 3.5
//     },
//     mainImage:
//       'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg',
//     id: 'd8f62b9a-9970-41e4-9f3c-56598ad07db6',
//     category: {
//       id: '12341234214',
//       name: 'Self Help',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },

//   {
//     name: 'Atomic Habits',
//     description:
//       'Thay Đổi Tí Hon Hiệu Quả Bất Ngờ',
//     price: 135000,
//     promotionalPrice: 120000,
//     quantity: 29,
//     rating: {
//       rate: 4.5
//     },
//     mainImage:
//       'https://cdn0.fahasa.com/media/catalog/product/z/5/z5076620072937_da8216298d99e526fef85c804c0c2389_2.jpg',
//     id: 'd8f62b9a-9970-41e4-9f3c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Self Help',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Sức Mạnh Tiềm Thức ',
//     description:
//       'Là một trong những quyển sách về nghệ thuật sống nhận được nhiều lời ngợi khen và bán chạy nhất mọi thời đại',
//     price: 130000,
//     promotionalPrice: 120000,
//     quantity: 33,
//     rating: {
//       rate: 4.8
//     },
//     mainImage:
//       'https://cdn0.fahasa.com/media/catalog/product/i/m/image_237646.jpg',
//     id: 'd8f6229a-9970-41e4-933c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Self Help',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Dám Nghĩ Lại',
//     description:
//       'Tái tư duy, theo Adam Grant, là suy nghĩ lại, cân nhắc lại quan điểm, định kiến, thậm chí là kiến thức của bản thân, cũng có thể là suy nghĩ thoát khỏi lối mòn tư duy. Cũng theo ông, để chinh phục kỹ năng này, bạn cần quên đi những gì đã học, đồng thời thiết lập và duy trì vòng lặp tái tư duy.',
//     price: 123000,
//     promotionalPrice: 110000,
//     quantity: 32,
//     rating: {
//       rate: 4.3
//     },
//     mainImage:
//       'https://cdn0.fahasa.com/media/catalog/product/d/a/damnghilai_bia01.jpg',
//     id: 'd8f6229a-9970-41e4-533c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Self Help',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Hành Tinh Của Một Kẻ Nghĩ Nhiều ',
//     description:
//       'Hành tinh của một kẻ nghĩ nhiều là hành trình khám phá thế giới nội tâm của một người trẻ. Đó là một hành tinh đầy hỗn loạn của những suy nghĩ trăn trở, những dằn vặt, những cuộc chiến nội tâm, những cảm xúc vừa phức tạp cũng vừa rất đỗi con người. Một thế giới quen thuộc với tất cả chúng ta. ',
//     price: 110000,
//     promotionalPrice: 100000,
//     quantity: 31,
//     rating: {
//       rate: 4.7
//     },
//     mainImage:
//       'https://cdn0.fahasa.com/media/catalog/product/h/_/h_nh-tinh-c_a-m_t-k_-ngh_-nhi_u-tr_c-1-1.jpg',
//     id: 'd8f6229a-9270-41e4-933c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Self Help',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Sherlock Holmes ',
//     description:
//       'Suy luận sắc bén cùng với những khả năng quan sát tuyệt vời đã biến Sherlock Holmes trở thành một tượng đài trinh thuyết nổi tiếng bậc nhất trên khắp toàn thế giới',
//     price: 140000,
//     promotionalPrice: 130000,
//     quantity: 36,
//     rating: {
//       rate: 5.0
//     },
//     mainImage:
//       'sherlockholmes.jpg',
//     id: 'd8f6229a-9270-41e4-923c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Trinh thám',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Sherlock Holmes ',
//     description:
//       'Suy luận sắc bén cùng với những khả năng quan sát tuyệt vời đã biến Sherlock Holmes trở thành một tượng đài trinh thuyết nổi tiếng bậc nhất trên khắp toàn thế giới',
//     price: 140000,
//     promotionalPrice: 130000,
//     quantity: 36,
//     rating: {
//       rate: 5.0
//     },
//     mainImage:
//       'sherlockholmes.jpg',
//     id: 'd8f6229a-92n0-41e4-923c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Trinh thám',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Sherlock Holmes ',
//     description:
//       'Suy luận sắc bén cùng với những khả năng quan sát tuyệt vời đã biến Sherlock Holmes trở thành một tượng đài trinh thuyết nổi tiếng bậc nhất trên khắp toàn thế giới',
//     price: 140000,
//     promotionalPrice: 130000,
//     quantity: 36,
//     rating: {
//       rate: 5.0
//     },
//     mainImage:
//       'sherlockholmes.jpg',
//     id: 'd8f6229a-9b70-41e4-923c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Trinh thám',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Sherlock Holmes ',
//     description:
//       'Suy luận sắc bén cùng với những khả năng quan sát tuyệt vời đã biến Sherlock Holmes trở thành một tượng đài trinh thuyết nổi tiếng bậc nhất trên khắp toàn thế giới',
//     price: 140000,
//     promotionalPrice: 130000,
//     quantity: 36,
//     rating: {
//       rate: 5.0
//     },
//     mainImage:
//       'sherlockholmes.jpg',
//     id: 'd8f6229a-92a0-41e4-923c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Trinh thám',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
//   {
//     name: 'Sherlock Holmes ',
//     description:
//       'Suy luận sắc bén cùng với những khả năng quan sát tuyệt vời đã biến Sherlock Holmes trở thành một tượng đài trinh thuyết nổi tiếng bậc nhất trên khắp toàn thế giới',
//     price: 140000,
//     promotionalPrice: 130000,
//     quantity: 36,
//     rating: {
//       rate: 5.0
//     },
//     mainImage:
//       'sherlockholmes.jpg',
//     id: 'd8f6222a-9270-41e4-923c-56598ad07db3',
//     category: {
//       id: '12341234214',
//       name: 'Trinh thám',
//       image: 'fjkhasjkfdskdjf'
//     },
//   },
// ];