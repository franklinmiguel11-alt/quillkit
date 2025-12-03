import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

export const SignRequestEmail = ({
    senderName,
    documentTitle,
    signingLink,
    message,
}: {
    senderName: string;
    documentTitle: string;
    signingLink: string;
    message?: string;
}) => (
    <Html>
        <Head />
        <Preview>{senderName} sent you a document to sign</Preview>
        <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans">
                <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                    <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                        Sign <strong>{documentTitle}</strong>
                    </Heading>
                    <Text className="text-black text-[14px] leading-[24px]">
                        Hello,
                    </Text>
                    <Text className="text-black text-[14px] leading-[24px]">
                        <strong>{senderName}</strong> has sent you a document to sign.
                    </Text>
                    {message && (
                        <Text className="text-black text-[14px] leading-[24px] p-4 bg-gray-50 rounded italic border border-gray-100">
                            "{message}"
                        </Text>
                    )}
                    <Section className="text-center mt-[32px] mb-[32px]">
                        <Button
                            className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                            href={signingLink}
                        >
                            Review & Sign
                        </Button>
                    </Section>
                    <Text className="text-black text-[14px] leading-[24px]">
                        or copy and paste this URL into your browser:{" "}
                        <a href={signingLink} className="text-blue-600 no-underline">
                            {signingLink}
                        </a>
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export const DocumentSignedEmail = ({
    signerName,
    documentTitle,
    downloadLink,
}: {
    signerName: string;
    documentTitle: string;
    downloadLink: string;
}) => (
    <Html>
        <Head />
        <Preview>{signerName} signed your document</Preview>
        <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans">
                <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                    <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                        Document Signed
                    </Heading>
                    <Text className="text-black text-[14px] leading-[24px]">
                        Great news! <strong>{signerName}</strong> has signed <strong>{documentTitle}</strong>.
                    </Text>
                    <Section className="text-center mt-[32px] mb-[32px]">
                        <Button
                            className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                            href={downloadLink}
                        >
                            Download Signed PDF
                        </Button>
                    </Section>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);
