import type { LanguageCode } from "@/i18n/config";

/**
 * Maqola matnlari.
 *
 * Sarlavha va qisqacha tavsif `pages:articles.<id>` da — ular blog
 * ro'yxatida va bosh sahifada doim ko'rinadi. To'liq matn esa faqat shu
 * yerda: u bir necha kilobayt proza va uni tarjima fayllariga qo'shsak,
 * maqolani umuman ochmagan tashrifchi ham har safar yuklab olardi.
 * Bu modul faqat maqola sahifasi (lazy marshrut) tomonidan import qilinadi.
 *
 * Matnlar namunaviy — do'kon o'z maqolalarini yozganda shu yerni
 * almashtiradi. Ular do'kon haqida hech qanday da'vo qilmaydi.
 */
export type ArticleBodies = Record<string, string[]>;

const uz: ArticleBodies = {
  "1": [
    "Xonani yangilash uchun mebelni almashtirish shart emas. Ko'pincha uchta narsa yetadi: yorug'lik, mato va bir nechta puxta tanlangan buyum. Ular bir-biriga qanday ishlashini tushunsangiz, xarajat ham, ovora bo'lish ham kamayadi.",
    "Yorug'likdan boshlang. Shiftdagi yagona chiroq xonani tekis va sovuq qiladi. Uning o'rniga uch nuqtaga yorug'lik qo'ying: stol chirog'i, pol chirog'i va devor yoritgichi. Kechqurun ularning ikkitasini yoqsangiz, xona butunlay boshqacha ko'rinadi.",
    "Matolar tovushni ham, ko'rinishni ham yumshatadi. Qalin parda, gilam va bir nechta yostiq — bularning har biri xonaga issiqlik qo'shadi. Ranglarni bir oilada saqlang: uch-to'rt xil ton yetarli, undan ortig'i bezovta qiladi.",
    "O'simlik qo'shing. Bitta katta o'simlik beshta kichkinasidan ko'ra kuchliroq ta'sir qiladi va parvarishi ham osonroq. Yorug'lik kam bo'lgan burchakka soyaga chidamli turlarni tanlang.",
    "Ko'zgu xonani kengaytiradi — ayniqsa deraza ro'parasiga osilsa, u yorug'likni ikki barobar qaytaradi. Ramkasi mebel bilan bir uslubda bo'lsa, u bezak emas, xonaning bir qismidek ko'rinadi.",
    "Devorga rasm osganda balandlikka e'tibor bering: markazi ko'z sathida, ya'ni poldan taxminan 145 sm balandlikda bo'lsin. Bir nechta rasmni birga osayotgan bo'lsangiz, ular orasida 5-8 sm masofa qoldiring.",
    "Oxirgi va eng muhim qadam — ortiqchasini olib tashlash. Har bir yuza to'la bo'lsa, ko'z dam olmaydi. Buyumlarning uchdan birini olib qo'ying va bir hafta shunday yashab ko'ring; ko'pincha ularni qaytarish istagi tug'ilmaydi.",
  ],
  "2": [
    "Oshxonada tartib go'zallik uchun emas, tezlik uchun kerak. Kerakli narsa qo'l yetadigan joyda bo'lsa, ovqat tayyorlash bir necha daqiqaga qisqaradi va idish yuvish ham osonlashadi.",
    "Ish yuzalarini bo'sh saqlang. Stol ustida faqat har kuni ishlatadigan narsalar tursin — qolganini shkafga joylang. Bo'sh yuza nafaqat toza ko'rinadi, balki ovqat tayyorlashda haqiqiy joy beradi.",
    "Buyumlarni qo'llanish chastotasi bo'yicha taqsimlang. Har kuni kerak bo'ladiganlar — ko'krak sathidagi javonlarda. Haftada bir marta ishlatiladiganlar — pastroq yoki balandroq. Yiliga bir marta ishlatiladigan narsalar oshxonada umuman turmasligi mumkin.",
    "Vertikal joydan foydalaning. Shkaf ichidagi qo'shimcha javon, eshik ichiga o'rnatilgan tutqich, magnitli pichoq taxtasi — bularning har biri stol yuzasini bo'shatadi va hech qanday ta'mirni talab qilmaydi.",
    "Sochiluvchan mahsulotlarni shaffof idishlarga soling va sana yozib qo'ying. Shunda nima borligini ochmasdan ko'rasiz va ikki marta sotib olmaysiz.",
    "Oshxonani zonalarga bo'ling: tayyorlash, pishirish, yuvish. Har bir zonaga tegishli buyumlarni yaqinroq joylang. Bu oddiy qoida ovqat tayyorlash paytidagi ortiqcha yurishlarni sezilarli qisqartiradi.",
  ],
  "3": [
    "Yotoqxona — uydagi yagona xona bo'lib, uning asosiy vazifasi ish emas, dam. Shuning uchun bu yerda bezakning har bir qarori bitta savolga javob berishi kerak: bu meni tinchlantiradimi?",
    "Xotirjam rang tanlang. Och kulrang, qum, oq va yumshoq ko'k ranglar ko'zni charchatmaydi. Yorqin rang kerak bo'lsa, uni kichik yuzada qoldiring — bitta yostiq yoki bitta rasm yetadi.",
    "Yorug'likni pasaytiring. Shiftdagi yorqin chiroq uyquga tayyorlanishga xalaqit beradi. Karavot yonida iliq va past yorug'lik bering; agar imkon bo'lsa, yorug'lik kuchini o'zgartiradigan chiroq qo'ying.",
    "Tabiiy matolarni afzal ko'ring. Paxta va zig'ir teri bilan yaxshi ishlaydi va havo o'tkazadi. Ular sun'iy matolarga qaraganda ancha uzoq xizmat qiladi va yuvilgan sari yumshoqroq bo'ladi.",
    "Karavot yonidagi stolni bo'sh saqlang: chiroq, kitob va bir stakan suv. Undan ortiq narsa ertalab ham, kechqurun ham ko'zga tashlanadi va tartibsizlik hissini beradi.",
    "Va nihoyat — ekranlarni imkon qadar uzoqroq qoldiring. Telefon zaryadlagichini boshqa xonaga ko'chirish yotoqxonaning vazifasini tiklashning eng arzon usuli.",
  ],
};

const ru: ArticleBodies = {
  "1": [
    "Чтобы обновить комнату, не обязательно менять мебель. Чаще всего достаточно трёх вещей: света, текстиля и нескольких удачно выбранных предметов. Когда понимаешь, как они работают вместе, и расходы, и хлопоты становятся меньше.",
    "Начните со света. Одна лампа на потолке делает комнату плоской и холодной. Вместо этого распределите свет по трём точкам: настольная лампа, торшер и настенный светильник. Включите вечером любые две — комната будет выглядеть совершенно иначе.",
    "Текстиль смягчает и звук, и вид. Плотная штора, ковёр и несколько подушек — каждая из этих вещей добавляет комнате тепла. Держите цвета в одной семье: трёх-четырёх оттенков достаточно, больше начинает утомлять.",
    "Добавьте растение. Одно крупное действует сильнее пяти маленьких и ухода требует меньше. Для тёмного угла выбирайте виды, которые мирятся с тенью.",
    "Зеркало расширяет комнату — особенно напротив окна, где оно удваивает свет. Если рама выдержана в том же стиле, что и мебель, зеркало читается не как украшение, а как часть комнаты.",
    "Вешая картину, следите за высотой: центр должен быть на уровне глаз, примерно в 145 см от пола. Если картин несколько, оставляйте между ними 5–8 см.",
    "Последний и самый важный шаг — убрать лишнее. Когда занята каждая поверхность, глазу негде отдохнуть. Уберите треть предметов и поживите так неделю; чаще всего возвращать их уже не хочется.",
  ],
  "2": [
    "Порядок на кухне нужен не ради красоты, а ради скорости. Когда нужное под рукой, готовка занимает на несколько минут меньше, да и мыть посуду проще.",
    "Держите рабочие поверхности свободными. На столе — только то, чем пользуетесь каждый день, остальное в шкаф. Свободная поверхность не просто выглядит чище: она даёт реальное место для готовки.",
    "Разложите вещи по частоте использования. Ежедневное — на полках на уровне груди. То, что нужно раз в неделю, — ниже или выше. Вещам, которые достают раз в год, на кухне вообще не место.",
    "Используйте вертикаль. Дополнительная полка внутри шкафа, рейлинг на дверце, магнитная планка для ножей — каждое из этих решений освобождает столешницу и не требует ремонта.",
    "Пересыпьте крупы в прозрачные банки и подпишите дату. Так вы видите запасы, не открывая их, и не покупаете второй раз то, что уже есть.",
    "Разделите кухню на зоны: подготовка, готовка, мойка. Держите нужные предметы ближе к своей зоне. Это простое правило заметно сокращает лишние шаги во время готовки.",
  ],
  "3": [
    "Спальня — единственная комната в доме, у которой главная задача не работа, а отдых. Поэтому каждое решение здесь должно отвечать на один вопрос: успокаивает ли это меня?",
    "Выберите спокойную палитру. Светло-серый, песочный, белый и приглушённый синий не утомляют глаз. Если нужен яркий цвет, оставьте его на небольшой площади — хватит одной подушки или одной картины.",
    "Приглушите свет. Яркая лампа на потолке мешает готовиться ко сну. Дайте у кровати тёплый и низкий свет; если есть возможность, поставьте светильник с регулировкой яркости.",
    "Предпочитайте натуральные ткани. Хлопок и лён хорошо ведут себя с кожей и пропускают воздух. Служат они заметно дольше синтетики и с каждой стиркой становятся мягче.",
    "Держите прикроватный столик пустым: лампа, книга и стакан воды. Всё сверх этого бросается в глаза и утром, и вечером и создаёт ощущение беспорядка.",
    "И последнее — уберите экраны как можно дальше. Перенести зарядку телефона в другую комнату — самый дешёвый способ вернуть спальне её назначение.",
  ],
};

const en: ArticleBodies = {
  "1": [
    "Refreshing a room rarely requires new furniture. Three things usually carry the change: light, textiles, and a few well chosen objects. Once you see how they work together, the effort and the cost both drop.",
    "Start with light. A single ceiling fixture flattens a room and cools it. Spread the light across three points instead — a table lamp, a floor lamp, a wall light. Switch on any two in the evening and the room reads completely differently.",
    "Textiles soften both sound and sight. A heavy curtain, a rug, a few cushions: each one adds warmth. Keep the colours in one family — three or four tones is plenty, and more starts to feel busy.",
    "Add a plant. One large plant does more than five small ones and takes less looking after. For a dark corner, pick species that tolerate shade rather than fighting the light you have.",
    "A mirror opens a room up, especially opposite a window where it doubles the daylight. When the frame matches the furniture, the mirror reads as part of the room rather than as decoration.",
    "Hanging pictures, watch the height: the centre belongs at eye level, roughly 145 cm from the floor. If you are hanging several together, leave 5–8 cm between them.",
    "The last step matters most — take things away. When every surface is occupied, the eye has nowhere to rest. Remove a third of the objects and live with it for a week; more often than not you will not want them back.",
  ],
  "2": [
    "A tidy kitchen is about speed, not looks. When what you need is within reach, cooking takes a few minutes less and washing up gets easier too.",
    "Keep the work surfaces clear. Leave out only what you use every day and put the rest in a cupboard. A clear surface does not just look cleaner — it gives you real room to cook.",
    "Sort things by how often you reach for them. Daily items go on shelves at chest height. Weekly items go higher or lower. Anything you use once a year does not need to live in the kitchen at all.",
    "Use the vertical space. An extra shelf inside a cupboard, a rail on the door, a magnetic knife strip — each frees up counter space and none of them require building work.",
    "Move dry goods into clear jars and write the date on them. You can see what you have without opening anything, and you stop buying a second bag of something you already own.",
    "Split the kitchen into zones: prep, cook, wash. Keep each zone's tools close to it. This one rule cuts a surprising number of steps out of every meal.",
  ],
  "3": [
    "The bedroom is the one room in the house whose job is rest rather than work. Every decision here should answer a single question: does this calm me down?",
    "Choose a quiet palette. Pale grey, sand, white and muted blue do not tire the eye. If you want a strong colour, keep it to a small area — one cushion or one picture is enough.",
    "Bring the light down. A bright ceiling lamp works against winding down. Put a warm, low light beside the bed, and use a dimmable fixture if you can.",
    "Favour natural fabrics. Cotton and linen sit well against skin and let air through. They also outlast synthetics by a wide margin and soften with every wash.",
    "Keep the bedside table almost empty: a lamp, a book, a glass of water. Anything beyond that catches the eye morning and night and reads as clutter.",
    "Finally, move the screens away. Charging your phone in another room is the cheapest way to give the bedroom its purpose back.",
  ],
};

export const ARTICLE_BODIES: Record<LanguageCode, ArticleBodies> = {
  uz,
  ru,
  en,
};
