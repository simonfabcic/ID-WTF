const TestPageMiddleScroll = () => {
    return (
        <div>
            {/* <header className="border text-center">header</header>

            <div className="flex gap-6 max-w-7xl mx-auto p-6">
                <div className="w-1/3 border h-fit">left</div>
                <div className="w-1/3 border h-3000px">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio, provident?Lorem ipsum,
                        dolor sit amet consectetur adipisicing elit. Assumenda, laudantium architecto ullam deserunt
                        maiores iusto temporibus unde quae consequatur omnis labore aut aliquid est dolorem,
                        necessitatibus inventore consequuntur? Accusamus deleniti similique distinctio iste nobis
                        facilis sapiente? A necessitatibus libero, consequatur adipisci ut rerum. Qui natus architecto
                        eum sequi deleniti numquam illo corrupti enim laudantium maiores placeat ipsam, impedit
                        repudiandae dolorum excepturi fuga hic vitae porro? Et, assumenda blanditiis? Ut nemo dolore
                        iusto accusantium dolorum nesciunt aspernatur veniam quas reiciendis, voluptatibus praesentium,
                        voluptatum blanditiis illum amet aut ducimus ad voluptas qui nobis neque suscipit placeat! Illo
                        itaque repellendus nemo omnis veritatis quidem recusandae harum nesciunt amet nostrum expedita
                        ipsum doloribus ex officiis voluptatibus iusto asperiores eligendi id similique error, soluta
                        voluptas? Eveniet eos, eligendi sit iure animi neque nihil ducimus cumque autem temporibus esse
                        alias voluptatum ab sunt quo assumenda asperiores eius doloribus laborum excepturi fugit. Sed
                        harum, quas quam animi maiores culpa inventore repudiandae laborum expedita consectetur! Debitis
                        magni inventore illo sed voluptates ad consequatur tenetur ratione. Quas architecto asperiores
                        in ducimus quibusdam quos ex accusamus, non magnam ratione? Sunt optio nam libero perferendis
                        suscipit rerum ut, dolores sapiente debitis quisquam repellat, animi, voluptatibus tempore
                        assumenda ex. Dicta officia sed maxime repudiandae nulla expedita soluta ullam sapiente, at
                        repellat optio commodi delectus corrupti, molestias, earum illum aut maiores eum exercitationem
                        eaque neque. Quam doloremque blanditiis, quaerat adipisci magni possimus voluptatem, doloribus
                        iure voluptatibus ipsum officiis modi corporis dignissimos veritatis! Voluptatibus rem quos illo
                        sit praesentium ab similique exercitationem. Cum doloremque quas ab, sint explicabo, facere ut
                        nesciunt voluptatum autem minus optio libero! Sequi nisi excepturi quaerat optio magni non
                        accusamus, quod quis fuga itaque minus atque sapiente aliquid eveniet, dicta at, ratione
                        repellat. Odio, vero blanditiis dolorum quos nihil incidunt et. Voluptates officiis nostrum cum
                        quas molestiae quisquam doloribus sequi nisi delectus, impedit laudantium quos placeat? Ipsum,
                        sapiente alias accusamus, non recusandae nemo adipisci explicabo ab obcaecati ducimus beatae
                        consectetur nobis? Quidem ipsam a quae quibusdam voluptas accusantium corrupti id eos?
                        Repudiandae, a. Odio doloribus autem libero nostrum sunt repellat. Autem necessitatibus ipsa
                        quia minus vitae non fugit cum eaque incidunt ab blanditiis, saepe repellendus nulla nesciunt?
                        Earum vitae id cum facilis fugiat odit quibusdam et ducimus, iusto impedit pariatur quisquam
                        eligendi dolorum nam culpa, quae libero est neque ab vero delectus? Excepturi eligendi
                        laudantium molestiae, nihil nulla numquam autem. Facilis tempora explicabo enim expedita tempore
                        exercitationem perferendis quia beatae rerum id error, necessitatibus fugiat saepe aut
                        praesentium natus placeat adipisci vitae maxime cum repellendus, assumenda omnis incidunt!
                        Laudantium expedita nam mollitia amet ducimus a accusamus, impedit quidem. Amet dolor saepe odit
                        dolores eligendi quae sunt id nisi neque aspernatur quibusdam perferendis iure deleniti hic
                        placeat quisquam dolore, sed velit mollitia aliquam provident molestiae. Sapiente perferendis
                        quaerat laborum, distinctio iste explicabo, labore vitae architecto animi ratione ducimus
                        repellat sit fugit nihil repellendus! Blanditiis fuga at, nisi iste vitae placeat optio quisquam
                        temporibus iure sapiente facilis distinctio cum. Praesentium reprehenderit unde recusandae,
                        quaerat numquam architecto veritatis corrupti accusantium. Illum aperiam eius eum asperiores, ab
                        perferendis est odio repellat! Vel aliquam autem blanditiis, molestias odio quod, dolores
                        voluptatum eum aliquid veritatis eaque voluptatibus. Veniam odio soluta esse, laudantium
                        quibusdam numquam, commodi tis consequuntur nobis est voluptatum. Eum cum tempore corporis alias
                        perferendis aliquam, a fugiat distinctio rerum magni necessitatibus magnam iusto velit sunt
                        neque veniam minus iure accusamus nostrum quidem earum fuga, doloremque assumenda. Veniam
                        pariatur accusamus numquam dolores provident. Fuga, inventore quasi! Magni in repudiandae
                        consequuntur aliquid ipsa voluptatem totam, nihil dignissimos accusamus dolor dolorem doloribus
                        esse iure quasi maxime error aut officia ab cum sunt commodi quam officiis eum distinctio. Nobis
                        totam eos similique quisquam exercitationem eius minima laboriosam quod. Accusamus iure hic
                        dicta illum dignissimos sit, vitae pariatur explicabo debitis? Vel labore quiavident modi
                        dolores nemo voluptas veniam facilis?
                    </p>
                </div>
                <div className="w-1/3 border h-fit">right</div>
            </div> */}
            <div className="h-screen flex flex-col">
                <header className="border text-center">header</header>

                <div className="flex gap-6 max-w-7xl mx-auto p-6 flex-1 overflow-hidden">
                    <div className="w-1/3 border h-fit">left</div>
                    <div className="w-1/3 border overflow-y-auto">
                        {/* To hide the scrollbar, use this classnames (oter solutions are with Tailwind plugin classes (scrollbar-ide plugin)):  */}
                        {/* <div className="w-1/3 border overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"> */}
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio, provident?Lorem ipsum,
                            dolor sit amet consectetur adipisicing elit. Assumenda, laudantium architecto ullam deserunt
                            maiores iusto temporibus unde quae consequatur omnis labore aut aliquid est dolorem,
                            necessitatibus inventore consequuntur? Accusamus deleniti similique distinctio iste nobis
                            facilis sapiente? A necessitatibus libero, consequatur adipisci ut rerum. Qui natus
                            architecto eum sequi deleniti numquam illo corrupti enim laudantium maiores placeat ipsam,
                            impedit repudiandae dolorum excepturi fuga hic vitae porro? Et, assumenda blanditiis? Ut
                            nemo dolore iusto accusantium dolorum nesciunt aspernatur veniam quas reiciendis,
                            voluptatibus praesentium, voluptatum blanditiis illum amet aut ducimus ad voluptas qui nobis
                            neque suscipit placeat! Illo itaque repellendus nemo omnis veritatis quidem recusandae harum
                            nesciunt amet nostrum expedita ipsum doloribus ex officiis voluptatibus iusto asperiores
                            eligendi id similique error, soluta voluptas? Eveniet eos, eligendi sit iure animi neque
                            nihil ducimus cumque autem temporibus esse alias voluptatum ab sunt quo assumenda asperiores
                            eius doloribus laborum excepturi fugit. Sed harum, quas quam animi maiores culpa inventore
                            repudiandae laborum expedita consectetur! Debitis magni inventore illo sed voluptates ad
                            consequatur tenetur ratione. Quas architecto asperiores in ducimus quibusdam quos ex
                            accusamus, non magnam ratione? Sunt optio nam libero perferendis suscipit rerum ut, dolores
                            sapiente debitis quisquam repellat, animi, voluptatibus tempore assumenda ex. Dicta officia
                            sed maxime repudiandae nulla expedita soluta ullam sapiente, at repellat optio commodi
                            delectus corrupti, molestias, earum illum aut maiores eum exercitationem eaque neque. Quam
                            doloremque blanditiis, quaerat adipisci magni possimus voluptatem, doloribus iure
                            voluptatibus ipsum officiis modi corporis dignissimos veritatis! Voluptatibus rem quos illo
                            sit praesentium ab similique exercitationem. Cum doloremque quas ab, sint explicabo, facere
                            ut nesciunt voluptatum autem minus optio libero! Sequi nisi excepturi quaerat optio magni
                            non accusamus, quod quis fuga itaque minus atque sapiente aliquid eveniet, dicta at, ratione
                            repellat. Odio, vero blanditiis dolorum quos nihil incidunt et. Voluptates officiis nostrum
                            cum quas molestiae quisquam doloribus sequi nisi delectus, impedit laudantium quos placeat?
                            Ipsum, sapiente alias accusamus, non recusandae nemo adipisci explicabo ab obcaecati ducimus
                            beatae consectetur nobis? Quidem ipsam a quae quibusdam voluptas accusantium corrupti id
                            eos? Repudiandae, a. Odio doloribus autem libero nostrum sunt repellat. Autem necessitatibus
                            ipsa quia minus vitae non fugit cum eaque incidunt ab blanditiis, saepe repellendus nulla
                            nesciunt? Earum vitae id cum facilis fugiat odit quibusdam et ducimus, iusto impedit
                            pariatur quisquam eligendi dolorum nam culpa, quae libero est neque ab vero delectus?
                            Excepturi eligendi laudantium molestiae, nihil nulla numquam autem. Facilis tempora
                            explicabo enim expedita tempore exercitationem perferendis quia beatae rerum id error,
                            necessitatibus fugiat saepe aut praesentium natus placeat adipisci vitae maxime cum
                            repellendus, assumenda omnis incidunt! Laudantium expedita nam mollitia amet ducimus a
                            accusamus, impedit quidem. Amet dolor saepe odit dolores eligendi quae sunt id nisi neque
                            aspernatur quibusdam perferendis iure deleniti hic placeat quisquam dolore, sed velit
                            mollitia aliquam provident molestiae. Sapiente perferendis quaerat laborum, distinctio iste
                            explicabo, labore vitae architecto animi ratione ducimus repellat sit fugit nihil
                            repellendus! Blanditiis fuga at, nisi iste vitae placeat optio quisquam temporibus iure
                            sapiente facilis distinctio cum. Praesentium reprehenderit unde recusandae, quaerat numquam
                            architecto veritatis corrupti accusantium. Illum aperiam eius eum asperiores, ab perferendis
                            est odio repellat! Vel aliquam autem blanditiis, molestias odio quod, dolores voluptatum eum
                            aliquid veritatis eaque voluptatibus. Veniam odio soluta esse, laudantium quibusdam numquam,
                            commodi tis consequuntur nobis est voluptatum. Eum cum tempore corporis alias perferendis
                            aliquam, a fugiat distinctio rerum magni necessitatibus magnam iusto velit sunt neque veniam
                            minus iure accusamus nostrum quidem earum fuga, doloremque assumenda. Veniam pariatur
                            accusamus numquam dolores provident. Fuga, inventore quasi! Magni in repudiandae
                            consequuntur aliquid ipsa voluptatem totam, nihil dignissimos accusamus dolor dolorem
                            doloribus esse iure quasi maxime error aut officia ab cum sunt commodi quam officiis eum
                            distinctio. Nobis totam eos similique quisquam exercitationem eius minima laboriosam quod.
                            Accusamus iure hic dicta illum dignissimos sit, vitae pariatur explicabo debitis? Vel labore
                            quiavident modi dolores nemo voluptas veniam facilis?
                        </p>
                    </div>
                    <div className="w-1/3 border h-fit">right</div>
                </div>
            </div>
        </div>
    );
};

export default TestPageMiddleScroll;
