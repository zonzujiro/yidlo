import React from 'react'

const PopUp = props => {
    const { venue, venue: { companyMeta } } = props;

    console.log(venue, companyMeta)

    const getAdress = ({ description }) => {
        if (description) {
            return <adress className='callout__address'>{description}</adress>
        }
        return
    }

    const getPhone = ({ Phones }) => {
        if (Phones.length && Phones[0].formatted) {
            return <div className='callout__phone'>{Phones.length && Phones[0].formatted}</div>
        }
        return
    }

    const getHours = ({ Hours }) => {
        if (Hours && Hours.text) {
            return <div className='callout__workhours'>Работает: {companyMeta.Hours.text}</div>
        }
        return
    }

    const getLinks = ({ Links }) => {
        if (Links.length && Links[0].href) {
            return <a href={Links[0].href}>Сайт заведения</a>
        }
        return
    }

    const getAverageBill = ({ Features }) => {
        const bill = Features.find(feature => feature.id == 'average_bill2')

        if (bill) {
            return <div>Средний счет: {bill.value}</div>
        }
        return
    }

    const getPaymentCard = ({ Features }) => {
        const card = Features.find(feature => feature.id == 'payment_by_credit_card')

        if (card) {
            return <div>{card.value ? 'Расчет картой' : 'Нет расчета картой'}</div>;
        }
        return
    }

    const getWiFi = ({ Features }) => {
        const wifi = Features.find(feature => feature.id == 'wi_fi')

        if (wifi && wifi.value) {
            return <div>Wi-Fi</div>
        }
        return
    }

    return (
        <div className='popup-content'>
            {getAdress(venue.properties)}
            {getHours(companyMeta)}
            {getPhone(companyMeta)}
            {getLinks(companyMeta)}
            {getAverageBill(companyMeta)}
            {getPaymentCard(companyMeta)}
            {getWiFi(companyMeta)}
        </div>
    )
}

export default PopUp
