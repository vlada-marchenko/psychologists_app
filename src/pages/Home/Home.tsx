import css from './Home.module.css'
import Icon from '../../components/Icon/Icon'
import { NavLink } from 'react-router-dom'

export default function Home() {
    return (
        <div className={css.container}>
            <div className={css.left}>
            <h1 className={css.title}>The road to the <span className={css.title_span}>depths</span> of the human soul</h1>
            <p className={css.text}>We help you to reveal your potential, overcome challenges and find a guide in your own life with the help of our experienced psychologists.</p>
            <NavLink className={css.button} to="psychologists">
                Get started
                <Icon name="arrow" className={css.button_icon} width={18} height={18}/>
            </NavLink>
            </div>
            <div className={css.right}>
                <div className={css.image_container}>
                <img className={css.image} src="/img/image.jpg" srcSet="/img/image@2x.jpg" alt="Illustration" />
                                <div className={css.quantity}>
                <div className={css.icon_quan}>
                    <Icon name="check" className={css.icon_sign} width={30} height={30}/>
                </div>
                <div className={css.quan_cont}>
                    <span className={css.text_quan}>Experienced psychologists</span>
                    <span className={css.number}>15,000</span>
                </div>
            </div>
            <div className={css.question}>
                <Icon name="question" className={css.icon_ques} width={10} height={15}/>
            </div>
            <div className={css.people}>
                <Icon name="people" className={css.icon_people} width={16} height={16}/>
            </div>
                </div>
            </div>
        </div>
    )
}