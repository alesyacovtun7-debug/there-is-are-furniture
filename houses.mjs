export const houses = [
{id:'classic',name:'Sunny Cottage',image:'01-классический-дом.png',features:['double-bed','yellow-armchair','bookshelves','sofa','kitchen']},
{id:'family',name:'Family Nest',image:'02-две-детские-кровати.png',features:['double-bed','two-single-beds','children-beds','two-bedrooms','yellow-armchair','bookshelves','sofa','kitchen']},
{id:'office',name:'Workday House',image:'03-отдельный-кабинет.png',features:['double-bed','office','bookshelves','yellow-armchair','sofa','kitchen']},
{id:'greenhouse',name:'Garden House',image:'04-сад-и-теплица.png',features:['double-bed','greenhouse','garden','bookshelves','sofa','kitchen']},
{id:'bunk',name:'Seaside Family',image:'05-двухъярусная-кровать.png',features:['double-bed','bunk-bed','children-beds','two-bedrooms','bookshelves','sofa','kitchen']},
{id:'art',name:'Artist Cottage',image:'06-мастерская-художника.png',features:['double-bed','easel','paintbrushes','bookshelves','sofa','kitchen']},
{id:'library',name:'Book Nook',image:'07-библиотека.png',features:['double-bed','library','bookshelves','sofa','kitchen']},
{id:'nursery',name:'Little Steps',image:'08-детская-для-малыша.png',features:['double-bed','crib','two-bedrooms','bookshelves','yellow-armchair','sofa','kitchen']},
{id:'music',name:'Music House',image:'09-музыкальная-комната.png',features:['double-bed','piano','records','bookshelves','sofa','kitchen']},
{id:'patio',name:'Patio Garden',image:'10-терраса-и-сад.png',features:['double-bed','patio','garden','lounge-chairs','yellow-armchair','bookshelves','sofa','kitchen']}
];
const fact=(text,feature,model,negative)=>({text,feature,model,negative});
const married=()=>fact("I'm 30 and I'm married. We need a double bed.",'double-bed','There is a double bed.',"There isn't a double bed here. Let's keep looking.");
const cooking=()=>fact("I love cooking at home. I need a kitchen.",'kitchen','There is a kitchen.',"There isn't a kitchen here.");
const books=()=>fact("I have lots of books. I need bookshelves.",'bookshelves','There are bookshelves.',"There aren't any bookshelves here. Try another home.");
const garden=()=>fact("I love growing vegetables. I want my own garden.",'garden','There is a garden.',"There isn't a vegetable garden here. Let's look at another home.");
export const rounds=[
{title:'Room for everyone',answer:'family',facts:[married(),{...fact('We have two children. They each need their own bed.','children-beds','There are two single beds for the children.',"There aren't two beds for the children here. They each need their own bed."),models:{bunk:'There is a bunk bed with two separate sleeping spaces for the children.'}}]},
{title:'A little green dream',answer:'greenhouse',facts:[garden(),fact('I also grow delicate plants. I need a greenhouse.','greenhouse','There is a greenhouse in the garden.',"There isn't a greenhouse here. Let's keep looking.")]},
{title:'Work from home',answer:'office',facts:[books(),fact('I work from home. I need a separate office.','office','There is a separate office.',"There isn't a separate office here. Try another home.")]},
{title:'A family holiday',answer:'bunk',facts:[fact('We need two bedrooms: one for us and one for our children.','two-bedrooms','There are two bedrooms.',"There aren't two bedrooms here."),fact('The children dream of sleeping in a bunk bed.','bunk-bed','There is a bunk bed in the bedroom.',"There isn't a bunk bed here. Keep looking.")]},
{title:'Space to create',answer:'art',facts:[cooking(),fact('I paint every day. I need an easel and space for my art.','easel','There is an easel in the art studio.',"There isn't an easel here. Let's find a home with an art studio.")]},
{title:'One more chapter',answer:'library',facts:[books(),fact('I want a whole room for reading: my own library.','library','There is a library with bookshelves.',"There isn't a separate library here. Try another home.")]},
{title:'A new arrival',answer:'nursery',facts:[married(),fact('We have a new baby! We need a crib.','crib','There is a crib in the nursery.',"There isn't a crib here. Let's find a home for the baby.")]},
{title:'Made for music',answer:'music',facts:[fact('I love relaxing on a sofa after work.','sofa','There is a sofa in the living room.',"There isn't a sofa here."),fact('I play the piano every day. I need a piano at home.','piano','There is a piano in the music room.',"There isn't a piano here. Let's keep looking.")]},
{title:'Lazy sunny afternoons',answer:'patio',facts:[garden(),fact('I love relaxing in the sun. I need lounge chairs outside.','lounge-chairs','There are two lounge chairs in the garden.',"There aren't any lounge chairs here. Try another garden.")]},
{title:'A cosy corner',answer:'classic',facts:[married(),fact('My favourite colour is yellow. I want a yellow armchair.','yellow-armchair','There is a yellow armchair in the living room.',"There isn't a yellow armchair here. Let's keep looking.")]}
];

const clients=[
 {name:'Alex',portrait:'buyer.png'},
 {name:'Olivia',portrait:'olivia.png'},
 {name:'Daniel',portrait:'daniel.png'},
 {name:'Mia',portrait:'mia.png'},
 {name:'Sofia',portrait:'sofia.png'},
 {name:'Noah',portrait:'noah.png'},
 {name:'Emma',portrait:'emma.png'},
 {name:'Liam',portrait:'liam.png'},
 {name:'Grace',portrait:'grace.png'},
 {name:'Jack',portrait:'jack.png'}
];
rounds.forEach((round,index)=>{round.client=clients[index];});
rounds[9].facts[1].models={nursery:'There is a rocking chair with yellow cushions in the nursery.'};

