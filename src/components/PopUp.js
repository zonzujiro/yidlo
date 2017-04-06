const getPhones = ({ Phones }) => {
    if (Array.isArray(Phones)) {
        return Phones.map(phone => 
            `<li class="mediaAttributes__groupListItem"> ${phone.formatted} </li>`
        ).join('')
        }
    return '';
}

const getHours = ({ Hours }) => {
    if (Hours && Hours.text) {
        return `<li class="mediaAttributes__groupListItem">Работает ${Hours.text}</li>`
    }
    return '';
}

const getLinks = ({ Links }) => {
    if (Array.isArray(Links)) {
        return Links.map(({ href }) => 
            `<li class="mediaAttributes__groupListItem"><a href=${href}>${href}</a></li>`
        ).join('')
    }
    return '';
}

const getAverageBill = ({ Features }) => {
    const bill = Features.find(feature => feature.id == 'average_bill2')

    if (bill) {
        return `<li class="mediaAttributes__groupListItem">
                    <span class="mediaAttributes__groupListItemSum">
                        Средний счет — <span class="mediaAttributes__groupListItemSumCurrency _uah">₴</span> ${bill.value}
                    </span>
                </li>`
    }
    return '';
}

const getBooleanFeature = ({ Features }, id) => {
    if (Array.isArray(Features)) {
        const feauture = Features.find(feature => feature.id == id)

        if (feauture && feauture.value) {
            return `<li class="mediaAttributes__groupListItem">${feauture.name}</li>`
        }
    }

    return '';
}

const getEnumFeature = ({ Features }, id) => {
    if (Array.isArray(Features)) {
        const feauture = Features.find(feature => feature.id == id)

        if (feauture) {
            return feauture.values.map(({ value }) => 
                `<li class="mediaAttributes__groupListItem">${value}</li>`
            ).join('')
        }
    }

    return '';
}

const getCategories = ({ Categories }) => {
    if (Array.isArray(Categories)) {
        return Categories.map(cat => cat.name).join(' / ');
    }

    return '';
}

const getPopupContent = venueProperties => {
    const { CompanyMetaData: companyMeta } = venueProperties;

    return (
        `<div class="mediaCard__block _animated" data-type="mediaAttributes">
            <div id="module-1-13-2-2-6" data-module="mediaAttributes" class="mediaAttributes">
                <h4 class="mediaAttributes__groupTitle">
                    <adress class='callout__address'>${venueProperties.description}</adress>
                </h4>
                <div class="mediaAttributes__block">
                    <div class="mediaAttributes__group">
                        <h3 class="mediaAttributes__groupTitle">${getCategories(companyMeta)}</h3>
                        <span class="mediaAttributes__groupListItemSum">
                            ${getAverageBill(companyMeta)}
                        </span>
                    </div>
                    <div class="mediaAttributes__group">
                        <ul class="mediaAttributes__groupList">
                            ${getBooleanFeature(companyMeta, 'business_lunch')}
                            ${getBooleanFeature(companyMeta, 'food_delivery')}
                            ${getBooleanFeature(companyMeta, 'payment_by_credit_card')}
                            ${getBooleanFeature(companyMeta, 'summer_terrace')}
                            ${getBooleanFeature(companyMeta, 'breakfast')}
                            ${getEnumFeature(companyMeta, 'type_cuisine')}
                            ${getEnumFeature(companyMeta, 'price_category')}
                            ${getBooleanFeature(companyMeta, 'wi_fi')}
                        </ul>
                    </div>
                </div>
                <div class="mediaAttributes__group">
                    <ul class="mediaAttributes__groupList">
                        ${getLinks(companyMeta)}
                    </ul>
                </div>
                <div class="mediaAttributes__group">
                    <ul class="mediaAttributes__groupList">
                        ${getHours(companyMeta)}
                    </ul>
                </div>
                <div class="mediaAttributes__block">
                    <ul class="mediaAttributes__groupList">
                        ${getPhones(companyMeta)}
                    </ul>
                </div>
            </div>
        </div>
    </div>`
    )
}

export default getPopupContent
