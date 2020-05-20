import axios from 'axios';
import moment = require("moment");
import * as express from "express";
import config from "../config";
import {obtainHrefToReplace} from "./hrefRepleacer";

class Content {
    constructor(text: string, reply: string) {
        this.text = text;
        this.reply = reply;
    }

    text: string;
    reply: string;
}

class FaqItem {
    constructor(type: string, content: Content) {
        this.type = type;
        this.content = content;
    }

    type: string;
    content: Content;
}

class Faq {
    constructor(watermark: string, elements: Array<FaqItem>) {
        this.watermark = watermark;
        this.elements = elements;
    }

    elements: Array<FaqItem>;
    watermark: string;
}

const faqItems: Array<FaqItem> = [];

const addItemToFaq = (text: string, reply: string, type: string) => {
    const content = new Content(text, reply);
    const faqItem = new FaqItem(type, content);
    faqItems.push(faqItem);
};

export const faqParser = async (req: Request, res: express.Response) => {

    console.log("staring faqParser")

    const source = 'https://www.gov.pl/web/koronawirus/pytania-i-odpowiedzi';
    const { JSDOM } = require('jsdom');

    try {
        const response = await axios.get(source);

        const { data, status } = response;

        if (status !== 200) {
            throw new Error('Can not fetch html');
        }

        const html = data.replace('&nbsp;', '')
            .replace(', a interesujące nas sprawy można zlokalizować, korzystając z wyszukiwarki', '');

        const dom = new JSDOM(html);

        const intro = dom.window.document.querySelector('#main-content p.intro')
            .textContent;

        addItemToFaq(intro, '', 'intro' );

        dom.window.document
            .querySelectorAll('#main-content div.editor-content')
            .forEach((editorContent: Element) => {
                const allEditorContentChildren = editorContent.querySelectorAll(
                    ':scope > *'
                );

                allEditorContentChildren.forEach((child: Element) => {
                    if (child.tagName.toLocaleLowerCase() === 'h3') {
                        addItemToFaq(child.textContent!, '', 'title' );
                    }
                    if (child.tagName.toLocaleLowerCase() === 'div') {
                        const allChildren = child.querySelectorAll(':scope > *');
                        allChildren.forEach(_child => {
                            if (_child.tagName.toLocaleLowerCase() === 'p') {
                                if (_child.textContent!.trim()) {
                                    addItemToFaq(_child.textContent!,'', 'paragraph_strong');
                                }
                            }
                            if (_child.tagName.toLocaleLowerCase() === 'details') {
                                const question = _child.querySelector('summary')!.textContent;
                                const answerSelector = _child.querySelector('p')!;
                                const { text, toReplace } = obtainHrefToReplace(answerSelector);
                                let answer = answerSelector.textContent;
                                const ul = _child.querySelector('ul');
                                if (ul) {
                                    const items = ul.querySelectorAll(':scope > li');
                                    items.forEach(
                                        (value: Element) => (answer = `${answer}\n${value.textContent}`)
                                    );
                                }

                                answer = answer!.replace(
                                    'COVID-19',
                                    '[url]COVID-19|https://www.gov.pl/web/koronawirus[url]'
                                );

                                answer = answer.replace(text, toReplace!);

                                addItemToFaq(question!, answer, 'details');
                            }
                        });
                    }
                });
            });

        const watermark = `${moment().format('YYYY-MM-D')} - ${source}`;
        const faq = new Faq(watermark, faqItems);

        res.set('Cache-Control', `public, max-age=${config.cache.maxAge}, s-maxage=${config.cache.sMaxAge}`);
        res.status(200)
            .send(JSON.stringify(faq));

        console.log("finished faqParser")

    } catch (exception) {
        throw new Error(exception);
    }
};

export default faqParser;
