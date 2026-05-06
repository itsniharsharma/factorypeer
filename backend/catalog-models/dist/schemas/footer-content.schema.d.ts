import { Schema, type InferSchemaType, type Model, Types } from "mongoose";
declare const footerLinkSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    external: boolean;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    external: boolean;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    external: boolean;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const footerColumnSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    title: string;
    sortOrder: number;
    links: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    sortOrder: number;
    links: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    title: string;
    sortOrder: number;
    links: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const footerSocialLinkSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    icon?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    icon?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    sortOrder: number;
    label: string;
    href: string;
    openInNewTab: boolean;
    icon?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const footerCtaBlockSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    ctaExternal: boolean;
    ctaOpenInNewTab: boolean;
    title?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    body?: string | null | undefined;
    ctaHref?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    ctaExternal: boolean;
    ctaOpenInNewTab: boolean;
    title?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    body?: string | null | undefined;
    ctaHref?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    ctaExternal: boolean;
    ctaOpenInNewTab: boolean;
    title?: string | null | undefined;
    ctaLabel?: string | null | undefined;
    body?: string | null | undefined;
    ctaHref?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const newsletterBlockSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    submitExternal: boolean;
    submitOpenInNewTab: boolean;
    title?: string | null | undefined;
    body?: string | null | undefined;
    inputPlaceholder?: string | null | undefined;
    buttonLabel?: string | null | undefined;
    submitHref?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    submitExternal: boolean;
    submitOpenInNewTab: boolean;
    title?: string | null | undefined;
    body?: string | null | undefined;
    inputPlaceholder?: string | null | undefined;
    buttonLabel?: string | null | undefined;
    submitHref?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    submitExternal: boolean;
    submitOpenInNewTab: boolean;
    title?: string | null | undefined;
    body?: string | null | undefined;
    inputPlaceholder?: string | null | undefined;
    buttonLabel?: string | null | undefined;
    submitHref?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const appDownloadBlockSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    appStore: {
        openInNewTab: boolean;
        label?: string | null | undefined;
        href?: string | null | undefined;
        imageUrl?: string | null | undefined;
    };
    googlePlay: {
        openInNewTab: boolean;
        label?: string | null | undefined;
        href?: string | null | undefined;
        imageUrl?: string | null | undefined;
    };
    title?: string | null | undefined;
    subtitle?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    appStore: {
        openInNewTab: boolean;
        label?: string | null | undefined;
        href?: string | null | undefined;
        imageUrl?: string | null | undefined;
    };
    googlePlay: {
        openInNewTab: boolean;
        label?: string | null | undefined;
        href?: string | null | undefined;
        imageUrl?: string | null | undefined;
    };
    title?: string | null | undefined;
    subtitle?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    appStore: {
        openInNewTab: boolean;
        label?: string | null | undefined;
        href?: string | null | undefined;
        imageUrl?: string | null | undefined;
    };
    googlePlay: {
        openInNewTab: boolean;
        label?: string | null | undefined;
        href?: string | null | undefined;
        imageUrl?: string | null | undefined;
    };
    title?: string | null | undefined;
    subtitle?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const connectBlockSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    feedbackCtaExternal: boolean;
    feedbackCtaOpenInNewTab: boolean;
    heading?: string | null | undefined;
    phoneSubtitle?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    feedbackCtaExternal: boolean;
    feedbackCtaOpenInNewTab: boolean;
    heading?: string | null | undefined;
    phoneSubtitle?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    feedbackCtaExternal: boolean;
    feedbackCtaOpenInNewTab: boolean;
    heading?: string | null | undefined;
    phoneSubtitle?: string | null | undefined;
    feedbackCtaLabel?: string | null | undefined;
    feedbackCtaHref?: string | null | undefined;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
declare const footerContentSchema: Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    columns: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }> & {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }>;
    newsletter: {
        submitExternal: boolean;
        submitOpenInNewTab: boolean;
        title?: string | null | undefined;
        body?: string | null | undefined;
        inputPlaceholder?: string | null | undefined;
        buttonLabel?: string | null | undefined;
        submitHref?: string | null | undefined;
    };
    appDownloads: {
        appStore: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        googlePlay: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
    };
    connect: {
        feedbackCtaExternal: boolean;
        feedbackCtaOpenInNewTab: boolean;
        heading?: string | null | undefined;
        phoneSubtitle?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
    };
    contact: {
        ctaExternal: boolean;
        ctaOpenInNewTab: boolean;
        title?: string | null | undefined;
        ctaLabel?: string | null | undefined;
        body?: string | null | undefined;
        ctaHref?: string | null | undefined;
    };
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }>;
    legalLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    preFooterHeading?: string | null | undefined;
    preFooterBody?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    columns: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }> & {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }>;
    newsletter: {
        submitExternal: boolean;
        submitOpenInNewTab: boolean;
        title?: string | null | undefined;
        body?: string | null | undefined;
        inputPlaceholder?: string | null | undefined;
        buttonLabel?: string | null | undefined;
        submitHref?: string | null | undefined;
    };
    appDownloads: {
        appStore: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        googlePlay: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
    };
    connect: {
        feedbackCtaExternal: boolean;
        feedbackCtaOpenInNewTab: boolean;
        heading?: string | null | undefined;
        phoneSubtitle?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
    };
    contact: {
        ctaExternal: boolean;
        ctaOpenInNewTab: boolean;
        title?: string | null | undefined;
        ctaLabel?: string | null | undefined;
        body?: string | null | undefined;
        ctaHref?: string | null | undefined;
    };
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }>;
    legalLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    preFooterHeading?: string | null | undefined;
    preFooterBody?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    columns: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }> & {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }>;
    newsletter: {
        submitExternal: boolean;
        submitOpenInNewTab: boolean;
        title?: string | null | undefined;
        body?: string | null | undefined;
        inputPlaceholder?: string | null | undefined;
        buttonLabel?: string | null | undefined;
        submitHref?: string | null | undefined;
    };
    appDownloads: {
        appStore: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        googlePlay: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
    };
    connect: {
        feedbackCtaExternal: boolean;
        feedbackCtaOpenInNewTab: boolean;
        heading?: string | null | undefined;
        phoneSubtitle?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
    };
    contact: {
        ctaExternal: boolean;
        ctaOpenInNewTab: boolean;
        title?: string | null | undefined;
        ctaLabel?: string | null | undefined;
        body?: string | null | undefined;
        ctaHref?: string | null | undefined;
    };
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }>;
    legalLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    preFooterHeading?: string | null | undefined;
    preFooterBody?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type FooterSocialLinkDoc = InferSchemaType<typeof footerSocialLinkSchema>;
export type FooterLinkDoc = InferSchemaType<typeof footerLinkSchema>;
export type FooterColumnDoc = InferSchemaType<typeof footerColumnSchema>;
export type FooterCtaBlockDoc = InferSchemaType<typeof footerCtaBlockSchema>;
export type FooterNewsletterBlockDoc = InferSchemaType<typeof newsletterBlockSchema>;
export type FooterAppDownloadBlockDoc = InferSchemaType<typeof appDownloadBlockSchema>;
export type FooterConnectBlockDoc = InferSchemaType<typeof connectBlockSchema>;
export type FooterContentDocument = InferSchemaType<typeof footerContentSchema> & {
    _id: Types.ObjectId;
};
export type FooterContentModel = Model<FooterContentDocument>;
export declare function registerFooterContentSchema(): Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    columns: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }> & {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }>;
    newsletter: {
        submitExternal: boolean;
        submitOpenInNewTab: boolean;
        title?: string | null | undefined;
        body?: string | null | undefined;
        inputPlaceholder?: string | null | undefined;
        buttonLabel?: string | null | undefined;
        submitHref?: string | null | undefined;
    };
    appDownloads: {
        appStore: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        googlePlay: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
    };
    connect: {
        feedbackCtaExternal: boolean;
        feedbackCtaOpenInNewTab: boolean;
        heading?: string | null | undefined;
        phoneSubtitle?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
    };
    contact: {
        ctaExternal: boolean;
        ctaOpenInNewTab: boolean;
        title?: string | null | undefined;
        ctaLabel?: string | null | undefined;
        body?: string | null | undefined;
        ctaHref?: string | null | undefined;
    };
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }>;
    legalLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    preFooterHeading?: string | null | undefined;
    preFooterBody?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    columns: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }> & {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }>;
    newsletter: {
        submitExternal: boolean;
        submitOpenInNewTab: boolean;
        title?: string | null | undefined;
        body?: string | null | undefined;
        inputPlaceholder?: string | null | undefined;
        buttonLabel?: string | null | undefined;
        submitHref?: string | null | undefined;
    };
    appDownloads: {
        appStore: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        googlePlay: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
    };
    connect: {
        feedbackCtaExternal: boolean;
        feedbackCtaOpenInNewTab: boolean;
        heading?: string | null | undefined;
        phoneSubtitle?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
    };
    contact: {
        ctaExternal: boolean;
        ctaOpenInNewTab: boolean;
        title?: string | null | undefined;
        ctaLabel?: string | null | undefined;
        body?: string | null | undefined;
        ctaHref?: string | null | undefined;
    };
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }>;
    legalLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    preFooterHeading?: string | null | undefined;
    preFooterBody?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    slug: string;
    status: "draft" | "published" | "archived";
    sortOrder: number;
    documentVersion: number;
    metadata: any;
    columns: Types.DocumentArray<{
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }> & {
        title: string;
        sortOrder: number;
        links: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            external: boolean;
        }>;
    }>;
    newsletter: {
        submitExternal: boolean;
        submitOpenInNewTab: boolean;
        title?: string | null | undefined;
        body?: string | null | undefined;
        inputPlaceholder?: string | null | undefined;
        buttonLabel?: string | null | undefined;
        submitHref?: string | null | undefined;
    };
    appDownloads: {
        appStore: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        googlePlay: {
            openInNewTab: boolean;
            label?: string | null | undefined;
            href?: string | null | undefined;
            imageUrl?: string | null | undefined;
        };
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
    };
    connect: {
        feedbackCtaExternal: boolean;
        feedbackCtaOpenInNewTab: boolean;
        heading?: string | null | undefined;
        phoneSubtitle?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
    };
    contact: {
        ctaExternal: boolean;
        ctaOpenInNewTab: boolean;
        title?: string | null | undefined;
        ctaLabel?: string | null | undefined;
        body?: string | null | undefined;
        ctaHref?: string | null | undefined;
    };
    socialLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        icon?: string | null | undefined;
    }>;
    legalLinks: Types.DocumentArray<{
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }, Types.Subdocument<import("bson").ObjectId, any, {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }> & {
        sortOrder: number;
        label: string;
        href: string;
        openInNewTab: boolean;
        external: boolean;
    }>;
    tenantId?: Types.ObjectId | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    createdBy?: Types.ObjectId | null | undefined;
    updatedBy?: Types.ObjectId | null | undefined;
    preFooterHeading?: string | null | undefined;
    preFooterBody?: string | null | undefined;
    copyrightText?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
//# sourceMappingURL=footer-content.schema.d.ts.map