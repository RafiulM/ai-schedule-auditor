flowchart TD
    A[User visits Landing Page] --> B[User Signs In or Signs Up]
    B --> C[Dashboard Page]
    C --> D[Open Chat Assistant]
    D --> E[User enters schedule description]
    E --> F[Request sent to API Chat Route]
    F --> G[Authenticate User]
    G --> H[Invoke AI Model]
    H --> I[AI Function Calling create_event]
    I --> J[Persist Event and Chat Message]
    J --> K[API returns confirmation]
    K --> D
    J --> L[Dashboard Calendar Updates]