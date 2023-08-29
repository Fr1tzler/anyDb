# AnyDB

## Описание

**AnyDB** - сервис, позволяющий хранить типизированные данные произвольного формата и обращаться к ним через REST API.

## Особенности

- Возможность изменять структуру данных в рантайме без перезапуска сервиса
- Полностью типизированный код
- Маленький размер бандла при билде *(почти мгновенная сборка проекта)*
- Покрытие тестами 95%+ *(in progress)*
- Только одна production-зависимость *(pg)*
- Кастомный CLI для создания, отката и применения миграций

## Запуск проекта

### Необходимое ПО

*(В скобках - версии, которые использую я)*

- Node JS *(18.12.1)*
- NPM *(8.19.2)*
- Docker  *(24.0.2)*

### Последовательность запуска

- `npm install` - установка зависимостей
- `npm run postgres:start-local` - запуск БД Postgres docker-контейнере *(убедитесь, что порт 5432 свободен)*
- `npm run start:dev` - запуск сервиса *(по умолчанию, используемый порт - 3000)*

## Использование

Ожидает написания

## License

Copyright (c) 2023-2023 Victor Fritsler (fr1tsl3r@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.