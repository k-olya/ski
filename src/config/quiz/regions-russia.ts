import { range } from "app/math";
import { reverseMap } from "app/reverse-map";

export const regions = new Map<string, string>([
  ["Алтайский край", "Барнаул"],
  ["Амурская область", "Благовещенск"],
  ["Еврейская АО", "Биробиджан"],
  ["Забайкальский край", "Чита"],
  ["Камчатский край", "Петропавловск-Камчатский"],
  ["Краснодарский край", "Краснодар"],
  ["Красноярский край", "Красноярск"],
  ["Ленинградская область", "Санкт-Петербург"],
  ["Ненецкий АО", "Нарьян-Мар"],
  ["Приморский край", "Владивосток"],
  ["Адыгея", "Майкоп"],
  ["Алтай", "Горно-Алтайск"],
  ["Башкортостан", "Уфа"],
  ["Бурятия", "Улан-Удэ"],
  ["Дагестан", "Махачкала"],
  ["Ингушетия", "Магас"],
  ["Кабардино-Балкария", "Нальчик"],
  ["Калмыкия", "Элиста"],
  ["Карачаево-Черкессия", "Черкесск"],
  ["Карелия", "Петрозаводск"],
  ["Коми", "Сыктывкар"],
  ["Крым", "Симферополь"],
  ["Марий Эл", "Йошкар-Ола"],
  ["Мордовия", "Саранск"],
  ["Респ. Саха (Якутия)", "Якутск"],
  ["Северная Осетия - Алания", "Владикавказ"],
  ["Татарстан", "Казань"],
  ["Тыва (Тува)", "Кызыл"],
  ["Удмуртия", "Ижевск"],
  ["Хакасия", "Абакан"],
  ["Чечня", "Грозный"],
  ["Чувашия", "Чебоксары"],
  ["Ростовская область", "Ростов-на-Дону"],
  ["Сахалинская область", "Южно-Сахалинск"],
  ["Свердловская область", "Екатеринбург"],
  ["Ставропольский край", "Ставрополь"],
  ["Хабаровский край", "Хабаровск"],
  ["Ханты-Мансийский АО - Югра", "Ханты-Мансийск"],
  ["Чукотский АО", "Анадырь"],
  ["Ямало-Ненецкий АО", "Салехард"],
]);

export const regions_reverse = reverseMap(regions);
